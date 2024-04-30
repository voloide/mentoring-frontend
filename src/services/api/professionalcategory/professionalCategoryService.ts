import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import { plainToClass } from 'class-transformer';
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
        dtoList.forEach(dto => {
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
      }

};