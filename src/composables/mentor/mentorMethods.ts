import useEmployee from 'src/composables/employee/employeeMethods'
import useProgrammaticArea from '../programmaticArea/programmaticAreaMethods';
import useTutorProgrammaticArea from '../tutorProgrammaticArea/tutorProgrammaticAreaMethods'
import Mentor from "src/stores/model/mentor/Mentor";
import mentorService from 'src/services/api/mentor/mentorService';

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

    // function createTutorProgrammaticAreasFromDTO(TutorProgrammaticAreasDTOS: any){
    //     const { createDTOFromEmployee } = useEmployee();
    //     const mentorDTo = {
    //         id: mentor.id,
    //         uuid: mentor.uuid,
    //         employeeDTO: createDTOFromEmployee(mentor.employee)
    //       };
    //       return mentorDTo;
    // }

    function createDTOFromMentor(mentor: Mentor) {
        const { createDTOFromEmployee } = useEmployee();
        const mentorDTo = {
            id: mentor.id,
            uuid: mentor.uuid,
            employeeDTO: createDTOFromEmployee(mentor.employee)
          };
          return mentorDTo;
    }

    return {
        createMentorFromDTO,
        createDTOFromMentor,
    }
}