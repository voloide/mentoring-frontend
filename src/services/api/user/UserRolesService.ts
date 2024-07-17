import UserRole from 'src/stores/model/role/UserRole';
import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import useUserRole from 'src/composables/userRole/userRoleMethods';
const userRoleRepo = useRepo(UserRole);
const { createUserRoleFromDTO } = useUserRole();

export default {
  async mergeUserRole(userId: number, roleId: number) {
    return await api()
      .put(`/userRoles/merge?userId=${userId}&roleId=${roleId}`)
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
        return { error: error.message };
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any[]) {
    dtoList?.forEach((dto: any) => {
      const entity = createUserRoleFromDTO(dto);
      userRoleRepo.save(entity);
    });
  },
  piniaGetAll() {
    const res = userRoleRepo
      .query()
      .withAllRecursive(2)
      .get();
    return res;
  },

};
