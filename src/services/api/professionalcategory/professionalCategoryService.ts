import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import ProfessionalCategory from 'src/stores/model/professionalCategory/ProfessionalCategory';
import useProfessionalCategory from 'src/composables/professionalCategory/professionalCategoryMethods';
import usePartner from 'src/composables/partner/partnerMethods';

const repo = useRepo(ProfessionalCategory);
const { createProfessionalCategoryFromDTO } = useProfessionalCategory();
const { createPartnerFromDTO } = usePartner();

export default {
  async getAll() {
    return await api()
      .get('/professionalCategories/getall')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createProfessionalCategoryFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    return repo.query().orderBy('description', 'asc').get();
  },
  async saveProfessionalCategory(professionalCategory: any) {
    return await api()
      .post('/professionalCategories/save', professionalCategory)
      .then((resp) => {
        repo.save(createProfessionalCategoryFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async deleteProfessionalCategory(professionalCategoryId: number) {
    try {
      const resp = await api().patch(
        `/professionalCategories/${professionalCategoryId}`
      );
      await api().delete(`/professionalCategories/${professionalCategoryId}`);
      repo.save(createProfessionalCategoryFromDTO(resp.data));
      return resp;
    } catch (error: any) {
      console.error('Error', error.message);
      // You might want to re-throw the error or handle it differently here
      throw error;
    }
  },

  async updateProfessionalCategory(professionalCategory: any) {
    return await api()
      .patch('/professionalCategories/update', professionalCategory)
      .then((resp) => {
        repo.save(createProfessionalCategoryFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
};
