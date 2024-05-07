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
        console.log('Error', error.message);
      });
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
  }
};
