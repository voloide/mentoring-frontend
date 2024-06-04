import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import ResponseType from 'src/stores/model/question/ResponseType';
import useResponseType from 'src/composables/question/responseTypeMethods';

const repo = useRepo(ResponseType);
const { createResponseTypeFromDTO } = useResponseType();

export default {
  async getAll() {
    return await api()
      .get('/responseTypes/getAll')
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
      const entity = createResponseTypeFromDTO(dto);
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
  },
};
