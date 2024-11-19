import useRole from 'src/composables/role/roleMethods'
import UserRole from "src/stores/model/role/UserRole";
import Role from "stores/model/role/Role";
import User from "stores/model/user/User";

export default function useUserRole() {

    function createUserRoleFromDTO(userRoleDTO: any) {
        const { createRoleFromDTO } = useRole();
        return new UserRole({
            id: userRoleDTO.id,
            uuid: userRoleDTO.uuid,
            role: createRoleFromDTO(userRoleDTO.roleDTO)
          });
    }

  function createDTOFromUserRole(userRole: any) {
    // return {
    //   id: userRole.id,
    //   uuid: userRole.uuid,
    //   lifeCycleStatus: 'ACTIVE'
    // };
    return []
  }

    return {
      createUserRoleFromDTO,
      createDTOFromUserRole
    }
}
