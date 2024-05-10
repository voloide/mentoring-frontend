import useEmployee from 'src/composables/employee/employeeMethods';
import Mentees from 'src/stores/model/mentees/Mentees';

export default function userMentees() {
  function createMenteesFromDTO(menteesDTO: any) {
    const { createEmployeeFromDTO } = useEmployee();

    return new Mentees({
      id: menteesDTO.id,
      uuid: menteesDTO.uuid,
      employee: createEmployeeFromDTO(menteesDTO.employeeDTO),
    });
  }

  function createDTOFromMentees(mentees: Mentees) {
    const { createDTOFromEmployee } = useEmployee();
    const menteesDTO = {
      id: mentees.id,
      uuid: mentees.uuid,
      employeeDTO: createDTOFromEmployee(mentees.employee),
    };
    return menteesDTO;
  }

  return {
    createMenteesFromDTO,
    createDTOFromMentees,
  };
}
