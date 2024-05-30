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
      // console.log(entity)
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
  getById(id: string) {
    return repo
      .query()
      .with('program')
      .where('id', id)
      .orderBy('description', 'asc')
      .first();
  },
  getProgrammaticAreasByProgramaId(programId: number) {
    return repo.query().with('program').where('program_id', programId).get();
  },
  async saveProgrammaticArea(programmaticarea: any) {
    return await api()
      .post('/programmaticareas', programmaticarea)
      .then((resp) => {
        repo.save(createProgrammaticAreaFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.log('Error', error.message);
      });
  },
  async deleteProgrammaticArea(programmaticareaId:number) {
    try {
      const resp = await api().patch(`/programs/${programmaticareaId}`);
      repo.save(createProgrammaticAreaFromDTO(resp.data));
      return resp;
    } catch (error:any) {
        console.log('Error', error.message);
        // You might want to re-throw the error or handle it differently here
        throw error;
    }
  },
};
