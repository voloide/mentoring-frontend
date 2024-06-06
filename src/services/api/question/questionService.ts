import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import Question from 'src/stores/model/question/Question';
import useQuestion from 'src/composables/question/questionMethods';

const repo = useRepo(Question);
const { createQuestionFromDTO } = useQuestion();

export default {
  async search(searchParam: string) {
    return await api()
      .get(`/questions/search?${new URLSearchParams(searchParam).toString()}`)
      .then((resp) => {
        //return this.generateEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async getAll() {
    return await api()
      .get('/questions/all')
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
      const entity = createQuestionFromDTO(dto);
      repo.save(entity);
    });
  },
  generateEntityFromDTO(dtoList: any) {
    const entities = [];
    dtoList.forEach((dto) => {
      entities.push(createQuestionFromDTO(dto));
    });
    return entities;
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    const res = repo
      .query()
      .withAllRecursive(2)
      .orderBy('description', 'asc')
      .get();
    return res;
  },
  getByName(question: string) {
    return repo
      .query()
      .where('question', question)
      .orderBy('question', 'asc')
      .first();
  },
  async saveQuestion(question: any) {
    return await api()
      .post('/questions/save', question)
      .then((resp) => {
        repo.save(createQuestionFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async deleteQuestion(questionId: number) {
    try {
      const resp = await api().patch(`/questions/${questionId}`);
      repo.save(createQuestionFromDTO(resp.data));
      return resp;
    } catch (error: any) {
      console.error('Error', error.message);
      // You might want to re-throw the error or handle it differently here
      throw error;
    }
  },

  async updateQuestion(program: any) {
    return await api()
      .patch('/questions/update', program)
      .then((resp) => {
        repo.save(createQuestionFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },

};
