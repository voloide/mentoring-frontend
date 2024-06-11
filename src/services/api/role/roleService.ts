import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import useRole from 'src/composables/role/roleMethods';
import Role from 'src/stores/model/role/Role';

const repo = useRepo(Role);
const { createRoleFromDTO } = useRole();

export default {
  async getAll() {
    return await api()
      .get('/roles/getAll')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList?.forEach((dto: any) => {
      const entity = createRoleFromDTO(dto);
      repo.save(entity);
    });
  },
  piniaGetAll() {
    const res = repo
      .query()
      .withAllRecursive(2)
      .orderBy('description', 'asc')
      .get();
    return res;
  },
  async saveQuestion(question: any) {
    return await api()
      .post('/roles/save', question)
      .then((resp) => {
        repo.save(createRoleFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
};
