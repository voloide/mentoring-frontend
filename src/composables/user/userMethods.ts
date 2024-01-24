import Employee from "src/stores/model/employee/Employee";
import useEmployee from 'src/composables/employee/employeeMethods'
import useUserRole from 'src/composables/userRole/userRoleMethods'
import Mentor from "src/stores/model/mentor/Mentor";
import User from "src/stores/model/user/User";

export default function useUser() {

    function createUserFromDTO(userDTO: any) {
        const { createEmployeeFromDTO } = useEmployee();
        return new User({
            id: userDTO.id,
            uuid: userDTO.uuid,
            salt: userDTO.salt,
            username: userDTO.username,
            employee: createEmployeeFromDTO(userDTO.employeeDTO),
            userRoles: createUserRoles(userDTO.userRoleDTOS)
          });
    }

    function createUserRoles(userRoleDTOS: any) {
        const { createUserRoleFromDTO } = useUserRole();
        const generated = []
        userRoleDTOS.forEach(userRole => {
            generated.push(createUserRoleFromDTO(userRole));
        });
        return generated;
    }

    return {
        createUserFromDTO,
    }
}