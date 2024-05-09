import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import TutorProgrammaticArea from 'src/stores/model/TutorProgrammaticArea/TutorProgrammaticArea';
import useTutorProgrammaticArea from 'src/composables/tutorProgrammaticArea/tutorProgrammaticAreaMethods';
import mentorService from '../mentor/mentorService';
import programmaticAreaService from '../programmaticArea/programmaticAreaService';
// import useProgrammaticArea from 'src/composables/programmaticArea/programmaticAreaMethods';

const repo = useRepo(TutorProgrammaticArea);
const {createTutorProgrammaticAreaFromDTO} = useTutorProgrammaticArea()
// const { createProgrammaticAreaFromDTO } = useProgrammaticArea();

export default {
  async getAll() {
    return await api()
      .get('/tutorprogrammaticareas/getAll')
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        console.log(error);
        console.log('Error', error.message);
      });
  },

  createNewTutorProgrammaticArea(mentor_id:any, programmaticArea_id:any){
    const {createDTOFromTutorProgrammaticArea} = useTutorProgrammaticArea()

      const tutor = mentorService.getById(mentor_id)
      const programmaticArea = programmaticAreaService.getById(programmaticArea_id)

      return createDTOFromTutorProgrammaticArea(new TutorProgrammaticArea({
        mentor: tutor,
        mentor_id: tutor?.id,
        programmaticArea: programmaticArea,
        programmatic_area_id: programmaticArea?.id
      }))
  },

  async changeLifeCycleStatus(tutorProgrammaticAreaDTO: any, selectedMentor:any) {
    let resp = null;
    resp = await api()
    .patch(`/tutorprogrammaticareas/changeLifeCicleStatus`, tutorProgrammaticAreaDTO)
    .then((resp) => {
      repo.save(createTutorProgrammaticAreaFromDTO([resp.data], selectedMentor));
      return resp;
    })
    .catch((error) => {
      console.log('Error', error.message);
    });
    return resp;
},

  async save(tutorProgrammaticArea: any, selectedMentor:any) {
    console.log(tutorProgrammaticArea);
    return await api()
       .post(`/tutorprogrammaticareas/save`, tutorProgrammaticArea)
      .then((resp) => {
        repo.save(createTutorProgrammaticAreaFromDTO([resp.data], selectedMentor));
        return resp;
      })
      .catch((error) => {
        console.log('Error', error);
      });
  },

  getById(id: any) {
    return repo
      .query()
      .withAllRecursive(2)
      .where('id', id)
      .orderBy('id', 'asc')
      .first();
  }
};
