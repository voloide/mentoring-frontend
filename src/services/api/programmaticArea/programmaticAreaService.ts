import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import ProgrammaticArea from 'src/stores/model/programmaticArea/ProgrammaticArea';
import useProgrammaticArea from 'src/composables/programmaticArea/programmaticAreaMethods';

const repo = useRepo(ProgrammaticArea);
const { createProgrammaticAreaFromDTO } = useProgrammaticArea();

export default {
  async getAll() {
    return await api()
      .get('/programmaticareas/getAll')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.log(error);
        console.log('Error', error.message);
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createProgrammaticAreaFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    return repo.query().orderBy('description', 'asc').get();
  },
  getByName(name: string) {
    return repo
      .query()
      .where('name', name)
      .orderBy('description', 'asc')
      .first();
  },
  getProgrammaticAreasByProgramaId(programId: number) {
    return repo.query().with('program').where('program_id', programId).get();
  },
};
