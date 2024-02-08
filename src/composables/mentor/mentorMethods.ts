import useEmployee from 'src/composables/employee/employeeMethods'
import Mentor from "src/stores/model/mentor/Mentor";

export default function useMentor() {

    function createMentorFromDTO(mentorDTO: any) {
        const { createEmployeeFromDTO } = useEmployee();
        return new Mentor({
            id: mentorDTO.id,
            uuid: mentorDTO.uuid,
            employee: createEmployeeFromDTO(mentorDTO.employeeDTO)
          });
    }

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