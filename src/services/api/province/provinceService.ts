import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import { plainToClass } from 'class-transformer';
import Province from 'src/stores/model/location/Province';
import useProvince from 'src/composables/province/provinceMethods';

const provinceRepo = useRepo(Province);
const { createProvinceFromDTO } = useProvince();

export default {

    async getAll() {
        return await api()
           .get(`/province/getall`)
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      generateAndSaveEntityFromDTO(dtoList: any) {
        dtoList.forEach((dto: any) => {
          const province = createProvinceFromDTO(dto)
          provinceRepo.save(province);
        });

      },
      deleteAllFromStorage() {
        provinceRepo.flush();
      },
      piniaGetAll() {
        return provinceRepo
                      .query()
                      .orderBy('designation', 'asc')
                      .get();
      }

};
