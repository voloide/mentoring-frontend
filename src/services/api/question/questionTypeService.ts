import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import QuestionType from 'src/stores/model/question/QuestionType';
import useQuestionType from 'src/composables/question/questionTypeMethods';

const repo = useRepo(QuestionType);
const { createQuestionTypeFromDTO } = useQuestionType();

export default {
  async getAll() {
    return await api()
      .get('/questionTypes/getAll')
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
      const entity = createQuestionTypeFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    return repo.query().orderBy('description', 'asc').get();
  },
  getByDescription(description: string) {
    return repo
      .query()
      .where('description', description)
      .orderBy('description', 'asc')
      .first();
  }
};