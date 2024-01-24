import useRole from 'src/composables/role/roleMethods'
import UserRole from "src/stores/model/role/UserRole";

export default function useUserRole() {

    function createUserRoleFromDTO(userRoleDTO: any) {
        const { createRoleFromDTO } = useRole();
        return new UserRole({
            id: userRoleDTO.id,
            uuid: userRoleDTO.uuid,
            role: createRoleFromDTO(userRoleDTO.roleDTO)
          });
    }

    return {
        createUserRoleFromDTO,
    }
}