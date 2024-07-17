import TutorProgrammaticArea from "stores/model/tutorProgrammaticArea/TutorProgrammaticArea";
import useProgrammaticArea from '../programmaticArea/programmaticAreaMethods';
import useProgram from "src/composables/program/programMethods";
import useMentor from '../mentor/mentorMethods';

export default function useTutorProgrammaticArea() {

  function createTutorProgrammaticAreaFromDTO(tutorProgrammaticAreaDTOS: any, mentorDTO: any) {

    const { createProgrammaticAreaFromDTO } = useProgrammaticArea()
    const tutorProgrammaticAreaList: TutorProgrammaticArea[] = []

    if (tutorProgrammaticAreaDTOS) {
      tutorProgrammaticAreaDTOS.forEach((tutorProgrammaticAreaDTO) => {
        tutorProgrammaticAreaList.push(
          new TutorProgrammaticArea({
            id: tutorProgrammaticAreaDTO.id,
            uuid: tutorProgrammaticAreaDTO.uuid,
            mentor_id: mentorDTO.id,
            lifeCycleStatus: tutorProgrammaticAreaDTO.lifeCycleStatus,
            programmaticArea: createProgrammaticAreaFromDTO(tutorProgrammaticAreaDTO.programmaticAreaDTO),
          })
        )
      })
    }

    return tutorProgrammaticAreaList
  }


    function createDTOFromTutorProgrammaticArea(tutorProgrammaticArea: TutorProgrammaticArea) {
      const { createDTOFromProgrammaticArea } = useProgrammaticArea()
      const {createDTOFromMentor} = useMentor()

        const tutorProgrammaticAreaDTO = {
            id: tutorProgrammaticArea.id,
            uuid: tutorProgrammaticArea.uuid,
            mentorId: tutorProgrammaticArea.mentor !== null ? tutorProgrammaticArea.mentor.id : null,
            // tutorDTO: createDTOFromMentor(tutorProgrammaticArea.mentor),
            programmaticAreaDTO: createDTOFromProgrammaticArea(tutorProgrammaticArea.programmaticArea),
            lifeCycleStatus: tutorProgrammaticArea.lifeCycleStatus,
          }
        return  tutorProgrammaticAreaDTO;
    }

    return {
        createTutorProgrammaticAreaFromDTO,
        createDTOFromTutorProgrammaticArea
      };
}
