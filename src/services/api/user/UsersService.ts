import api from "../apiService/apiService";
import { useRepo } from "pinia-orm";
import { UserDTO } from "src/services/dto/user/UserDTO";
import { plainToClass } from "class-transformer";
import User from "src/stores/model/user/User";

const ronda = useRepo(User);

export default {

    async post(obj: string) {
        try {
            const resp = await api().post('user', plainToClass(UserDTO, obj, { excludeExtraneousValues: true }));
            
        } catch (error: any) {
            console.error(error);
        }

    },
    async login(params: any) {
        return api()
      .post('/login', params)
      .then((resp) => {
        console.log(resp)
        // userLogin.save(resp.data);
        return resp;
      })
      .catch((error) => {
          console.log('Error', error.message);
        
        //return error;
      });

    }

};