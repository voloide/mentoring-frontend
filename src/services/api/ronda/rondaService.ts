import Ronda from "src/stores/model/ronda/Ronda";
import api from "../apiService/apiService";
import { useRepo } from "pinia-orm";
import { UserDTO } from "src/services/dto/user/UserDTO";
import { plainToClass } from "class-transformer";

const ronda = useRepo(Ronda);

export default {

    async post(obj: string) {
        try {
            const resp = await api().post('ronda', plainToClass(UserDTO, obj, { excludeExtraneousValues: true }));
            //ronda.save();
            console.info('Saved Ronda')
        } catch (error: any) {
            console.error(error);
        }

    }

};