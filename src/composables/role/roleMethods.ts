import useAuthorityRole from 'src/composables/authorityRole/authorityRoleMethods';
import Role from 'src/stores/model/role/Role';

export default function useRole() {
  function createRoleFromDTO(roleDTO: any) {
    return new Role({
      id: roleDTO.id,
      uuid: roleDTO.uuid,
      description: roleDTO.description,
      code: roleDTO.code,
      level: roleDTO.level,
      hierarchyLevel: roleDTO.hierarchyLevel,
      roleAuthorities: createRoleAuthorities(roleDTO.roleAuthorityDTOS),
    });
  }

  function createRoleAuthorities(roleAuthorityDTOS: any[]) {
    const { createRoleAuthorityFromDTO } = useAuthorityRole();
    const generatedRoleAuths: any = [];
    roleAuthorityDTOS?.forEach((roleAuth: any) => {
      generatedRoleAuths.push(createRoleAuthorityFromDTO(roleAuth));
    });
    return generatedRoleAuths;
  }

  return {
    createRoleFromDTO,
  };
}
