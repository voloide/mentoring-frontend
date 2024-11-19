import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import FormSectionQuestion from 'stores/model/form/FormSectionQuestion';
import useFormSectionQuestion from 'src/composables/form/formSectionQuestionMethods';

const repo = useRepo(FormSectionQuestion);
const { createFormSectionQuestionFromDTO } = useFormSectionQuestion();

export default {
  async search(searchParam: string) {
    return await api()
      .get(
        `/formSectionQuestions/getByFormId?${new URLSearchParams(
          searchParam
        ).toString()}`
      )
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data?.content);
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
  async remove(searchParam: string, formSectionQuestion: any) {
    return await api()
      .patch(
        `/formSectionQuestions/remove?${new URLSearchParams(searchParam).toString()}`,
        formSectionQuestion
      )
      .then((resp) => {
        this.update(formSectionQuestion);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async disassociateQuesion(formSectionQuestionId: number) {
    return await api()
      .delete(`/formSectionQuestions/${formSectionQuestionId}`)
      .then(
        (resp) => {
          repo.destroy(formSectionQuestionId);
          return resp;
        })
      .catch((error) => {
        console.error('Error', error.message);
      });
    repo.delete(formSectionQuestionId);
  },
  update(formQuestion: any) {
    repo.save(formQuestion);
  },
};
