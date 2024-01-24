import Employee from "src/stores/model/employee/Employee";
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

    return {
        createMentorFromDTO,
    }
}