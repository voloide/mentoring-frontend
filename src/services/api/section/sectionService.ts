import api from '../apiService/apiService'; // Import your API service
import { useRepo } from 'pinia-orm'; // Import Pinia ORM repo for managing state
import Section from 'src/stores/model/section/Section'; // Import the Section model
import useSection from 'src/composables/section/sectionMethods'; // Import the section methods composable

const repo = useRepo(Section); // Get the repository for Section model
const { createSectionFromDTO } = useSection(); // Use the method to convert DTO to Section

export default {
  // Fetch all section from the API and save them into the store
  async getAllSections() {
    try {
      const resp = await api().get('/section');
      this.generateAndSaveEntityFromDTO(resp.data);
      return resp.data;
    } catch (error) {
      console.error('Error fetching section:', error.message);
    }
  },

  // Fetch a specific section by ID from the API and save it into the store
  async getSectionById(id) {
    try {
      const resp = await api().get(`/section/${id}`);
      const section = createSectionFromDTO(resp.data);
      repo.save(section); // Save the section into the store
      return section;
    } catch (error) {
      console.error(`Error fetching section with ID ${id}:`, error.message);
    }
  },

  // Create a new section by sending a POST request to the API and save it into the store
  async createSection(sectionDTO) {
    try {
      const resp = await api().post('/section', sectionDTO);
      const section = createSectionFromDTO(resp.data);
      repo.save(section); // Save the new section into the store
      return section;
    } catch (error) {
      console.error('Error creating section:', error.message);
    }
  },

  // Update an existing section by sending a PUT request to the API and save it into the store
  async updateSection(id, sectionDTO) {
    try {
      const resp = await api().put(`/section/${id}`, sectionDTO);
      const section = createSectionFromDTO(resp.data);
      repo.save(section); // Save the updated section into the store
      return section;
    } catch (error) {
      console.error(`Error updating section with ID ${id}:`, error.message);
    }
  },

  // Delete a section by ID by sending a DELETE request to the API and remove it from the store
  async deleteSection(id) {
    try {
      const resp = await api().delete(`/section/${id}`);
      repo.destroy(id); // Remove the section from the store
      return resp;
    } catch (error) {
      console.error(`Error deleting section with ID ${id}:`, error.message);
    }
  },

  // Convert DTO list to Section entities and save them to the store
  generateAndSaveEntityFromDTO(dtoList) {
    dtoList.forEach((dto) => {
      const section = createSectionFromDTO(dto);
      repo.save(section); // Save each section into the store
    });
  },

  insert(section: Section) {
    repo.save(section);
  },
  
  // Delete all section from the local Pinia store
  deleteAllFromStorage() {
    repo.flush(); // Clear all data from the store
  },

  // Fetch all section from the Pinia store and order them by ID
  piniaGetAll() {
    return repo.query().orderBy('id', 'asc').get(); // Get all section in ascending order
  },

  // Fetch all section along with their relationships from the Pinia store
  getSectionList() {
    return repo.query().withAllRecursive(2).orderBy('id', 'asc').get(); // Fetch all section recursively up to 2 levels
  },
};
