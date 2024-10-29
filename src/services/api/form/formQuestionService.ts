import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import FormSectionQuestion from 'stores/model/form/FormSectionQuestion';
import useFormSectionQuestion from 'src/composables/form/formQuestionMethods';

const repo = useRepo(FormSectionQuestion);
const { createFormSectionQuestionFromDTO } = useFormSectionQuestion();

export default {
  async search(searchParam: string) {
    return await api()
      .get(
        `/formQuestions/getByFormId?${new URLSearchParams(
          searchParam
        ).toString()}`
      )
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto) => {
      const entity = createFormSectionQuestionFromDTO(dto);
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
    return repo.query().withAllRecursive(2).orderBy('id', 'asc').get();
  },
  getById(id: number) {
    return repo
      .query()
      .withAllRecursive(2)
      .where('id', id)
      .orderBy('id', 'asc')
      .first();
  },
  async remove(searchParam: string, formQuestion: any) {
    return await api()
      .patch(
        `/formQuestions/remove?${new URLSearchParams(searchParam).toString()}`,
        formQuestion
      )
      .then((resp) => {
        this.update(formQuestion);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  update(formQuestion: any) {
    repo.save(formQuestion);
  },
};
