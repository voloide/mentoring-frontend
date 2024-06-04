import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import Program from 'src/stores/model/program/Program';
import useProgram from 'src/composables/program/programMethods';

const repo = useRepo(Program);
const { createProgramFromDTO } = useProgram();

export default {
  async getAll() {
    return await api()
      .get('/programs/getAll')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  getProgramList() {
    return repo.query().withAllRecursive(2).orderBy('id', 'asc').get();
  },
  getById(id: any) {
    return repo
      .query()
      .withAllRecursive(2)
      .where('id', id)
      .orderBy('id', 'asc')
      .first();
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createProgramFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    const programs = repo.query().orderBy('name', 'asc').get();
    return programs;
  },
  async saveProgram(program: any) {
    return await api()
      .post('/programs/save', program)
      .then((resp) => {
        repo.save(createProgramFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async deleteProgram(programId: number) {
    try {
      const resp = await api().patch(`/programs/${programId}`);
      repo.save(createProgramFromDTO(resp.data));
      return resp;
    } catch (error: any) {
      console.error('Error', error.message);
      // You might want to re-throw the error or handle it differently here
      throw error;
    }
  },
};
