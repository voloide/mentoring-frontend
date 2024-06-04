import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import { UserDTO } from 'src/services/dto/user/UserDTO';
import { plainToClass } from 'class-transformer';
import useUser from 'src/composables/user/userMethods';
import User from 'src/stores/model/user/User';

const userRepo = useRepo(User);
const { createUserFromDTO } = useUser();

export default {
  async post(obj: string) {
    try {
      const resp = await api().post(
        'user',
        plainToClass(UserDTO, obj, { excludeExtraneousValues: true })
      );
    } catch (error: any) {
      console.error(error);
    }
  },
  async login(params: any) {
    return api()
      .post('/login', params)
      .then((resp) => {
        if (resp.status === 200) {
          this.convertUserFromDTO(resp.data.userInfo);
        }
        return resp;
      })
      .catch((error) => {
        return error;
      });
  },
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('tokenExpiration');
  },
  convertUserFromDTO(userDTO: any) {
    const user = createUserFromDTO(userDTO);
    userRepo.save(user);
  },
  getLogedUser() {
    const userloged = JSON.stringify(localStorage.getItem('username'));
    // console.log(userloged);
    return (
      userRepo
        .query()
        .withAll()
        //.where('username', userloged)
        .first()
    );
  },
  piniaSave(user: User) {
    return userRepo.save(user);
  },
  async getAll() {
    return await api()
      .get('/user/getAll')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error(error);
        console.error('Error', error.message);
      });
  },
  piniaGetAll() {
    const res = userRepo
      .query()
      .withAllRecursive(2)
      .orderBy('username', 'asc')
      .get();
    return res;
  },
  async saveUser(user: any) {
    return await api()
      .post('/user/save', user)
      .then((resp) => {
        userRepo.save(createUserFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async deleteUser(userId: number) {
    try {
      const resp = await api().patch(`/user/${userId}`);
      userRepo.save(createUserFromDTO(resp.data));
      return resp;
    } catch (error: any) {
      console.error('Error', error.message);
      // You might want to re-throw the error or handle it differently here
      throw error;
    }
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createUserFromDTO(dto);
      userRepo.save(entity);
    });
  },
};
