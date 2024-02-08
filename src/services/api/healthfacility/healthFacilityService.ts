import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import { plainToClass } from 'class-transformer';
import HealthFacility from 'src/stores/model/healthfacility/HealthFacility';
import useHealthFacility from 'src/composables/healthFacility/healthFacility';

const healthFacilityRepo = useRepo(HealthFacility);
const { createHealthFacilityFromDTO } = useHealthFacility();

export default {

    async getByDistrict(districtId: any) {
        return await api()
           .get(`/healthfacility/getAllOfDistrict/${districtId}`)
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      async getAll() {
        return await api()
           .get(`/healthfacility/getall`)
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      async getByProvince(provinceId: any) {
        return await api()
           .get(`/healthfacility/getAllOfProvince/${provinceId}`)   
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      generateAndSaveEntityFromDTO(dtoList: any) {
        dtoList.forEach(dto => {
          const entity = createHealthFacilityFromDTO(dto)
          healthFacilityRepo.save(entity);
        });

      },
      deleteAllFromStorage() {
        healthFacilityRepo.flush();
      },
      piniaGetAll() {
        return healthFacilityRepo
                                .query()
                                .orderBy('healthFacility', 'asc')
                                .get();
                },
      getAllOfDistrict(districtId: number) {
        return healthFacilityRepo
                                .query()
                                .with('district')
                                .where('districtId', districtId)
                                .get();
      },

};