import useAuthority from 'src/composables/authoriry/authorityMethods'
import RoleAuthority from "src/stores/model/role/RoleAuthority";

export default function useAuthorityRole() {

    function createRoleAuthorityFromDTO(authorityRoleDTO: any) {
        const { createAuthorityFromDTO } = useAuthority();
        return new RoleAuthority({
            id: authorityRoleDTO.id,
            uuid: authorityRoleDTO.uuid,
            authority: createAuthorityFromDTO(authorityRoleDTO.authorityDTO),
          });
    }

    return {
        createRoleAuthorityFromDTO,
    }
}