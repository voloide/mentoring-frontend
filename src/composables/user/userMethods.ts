import Employee from 'src/stores/model/employee/Employee';
import useEmployee from 'src/composables/employee/employeeMethods';
import useUserRole from 'src/composables/userRole/userRoleMethods';
import Mentor from 'src/stores/model/mentor/Mentor';
import User from 'src/stores/model/user/User';

export default function useUser() {
  function createUserFromDTO(userDTO: any) {
    const { createEmployeeFromDTO } = useEmployee();
    return new User({
      id: userDTO.id,
      uuid: userDTO.uuid,
      salt: userDTO.salt,
      username: userDTO.username,
      employee: createEmployeeFromDTO(userDTO.employeeDTO),
      userRoles: userDTO.userRoleDTOS ? createUserRoles(userDTO.userRoleDTOS) : [],
      lifeCycleStatus: userDTO.lifeCycleStatus
    });
  }

  function createUserRoles(userRoleDTOS: any) {
    const { createUserRoleFromDTO } = useUserRole();
    const generated: any = [];
    userRoleDTOS?.forEach((userRole: any) => {
      generated.push(createUserRoleFromDTO(userRole));
    });
    return generated;
  }

  function createDTOFromUser(user: any) {
    const { createDTOFromEmployee } = useEmployee();
    const userDTO = {
      username: user.username,
      password: user.password,
      employeeDTO: createDTOFromEmployee(user.employee),
    };
    return userDTO;
  }

  return {
    createUserFromDTO,
    createDTOFromUser,
  };
}
