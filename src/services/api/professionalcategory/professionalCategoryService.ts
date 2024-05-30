import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import ProfessionalCategory from 'src/stores/model/professionalCategory/ProfessionalCategory';
import useProfessionalCategory from 'src/composables/professionalCategory/professionalCategoryMethods';

const repo = useRepo(ProfessionalCategory);
const { createProfessionalCategoryFromDTO } = useProfessionalCategory();

export default {

  async getAll() {
    return await api()
      .get(`/professionalCategories/getall`)
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.log('Error', error.message);
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createProfessionalCategoryFromDTO(dto)
      repo.save(entity);
    });

      },
      deleteAllFromStorage() {
        repo.flush();
      },
      piniaGetAll() {
        return repo.query()
                   .orderBy('description', 'asc')
                   .get();
      },
      async saveProfessionalCategory(professionalCategory: any) {
        return await api()
          .post('/professionalCategories/save', professionalCategory)
          .then((resp) => {
            repo.save(createProfessionalCategoryFromDTO(resp.data));
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
};
