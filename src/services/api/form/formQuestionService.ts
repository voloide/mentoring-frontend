import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import FormQuestion from 'src/stores/model/form/FormQuestion';
import useFormQuestion from 'src/composables/form/formQuestionMethods';

const repo = useRepo(FormQuestion);
const { createFormQuestionFromDTO }  = useFormQuestion();

export default {
    async search(searchParam: string) {
        return await api()
          .get(`/formQuestions/getByFormId?${new URLSearchParams(searchParam).toString()}`)
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      generateAndSaveEntityFromDTO(dtoList: any) {
        dtoList.forEach((dto) => {
          const entity = createFormQuestionFromDTO(dto);
          repo.save(entity);
        });
      },
      deleteAllFromStorage() {
        repo.flush();
      },
      piniaGetAll() {
        return repo.query().orderBy('id', 'asc').get();
      },
      getFormQuestionList() {
        return repo
                      .query()
                      .withAllRecursive(2)
                      .orderBy('id', 'asc')
                      .get();
      },
      getById(id: number) {
        return repo
                      .query()
                      .withAllRecursive(2)
                      .where('id', id)
                      .orderBy('id', 'asc')
                      .first();
      }
}