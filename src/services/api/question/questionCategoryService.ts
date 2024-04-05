import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import QuestionCategory from 'src/stores/model/question/QuestionCategory';
import useQuestionCategory from 'src/composables/question/questionCategoryMethods';

const repo = useRepo(QuestionCategory);
const { createQuestionCategoryFromDTO } = useQuestionCategory();

export default {
  async getAll() {
    return await api()
      .get('/questionCategories/getAll')
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
      const entity = createQuestionCategoryFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    return repo.query().orderBy('category', 'asc').get();
  },
  getByName(category: string) {
    return repo
      .query()
      .where('category', category)
      .orderBy('category', 'asc')
      .first();
  }
};