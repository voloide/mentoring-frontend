import useEmployee from 'src/composables/employee/employeeMethods'
import useTutorProgrammaticArea from '../tutorProgrammaticArea/tutorProgrammaticAreaMethods'
import Mentor from "src/stores/model/mentor/Mentor";

export default function useMentor() {

    function createMentorFromDTO(mentorDTO: any) {
        const { createEmployeeFromDTO } = useEmployee();
        const { createTutorProgrammaticAreaFromDTO } = useTutorProgrammaticArea()
        return new Mentor({
            id: mentorDTO.id,
            uuid: mentorDTO.uuid,
            employee: createEmployeeFromDTO(mentorDTO.employeeDTO),
            tutorProgrammaticAreas: createTutorProgrammaticAreaFromDTO(mentorDTO.tutorProgrammaticAreaDTOS, mentorDTO)
          });
    }

    function createDTOFromMentor(mentor: Mentor) {
        const { createDTOFromEmployee } = useEmployee();
        const mentorDTo = {
            id: mentor.id,
            uuid: mentor.uuid,
            employeeDTO: createDTOFromEmployee(mentor.employee),
            tutorProgrammaticAreaDTOS: createDTOsFromTPAs(mentor.tutorProgrammaticAreas)
          };
          return mentorDTo;
    }

    function createDTOsFromTPAs(tutorProgrammaticAreas: any) {
	    const {createDTOFromTutorProgrammaticArea} = useTutorProgrammaticArea()
	    const tutorProgrammaticAreaDTOs = []
	    tutorProgrammaticAreas.forEach((tpa) => {
	      tutorProgrammaticAreaDTOs.push(createDTOFromTutorProgrammaticArea(tpa))
	    })

	    return tutorProgrammaticAreaDTOs
	  }

    return {
        createMentorFromDTO,
        createDTOFromMentor,
    }
}
