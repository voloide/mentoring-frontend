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
      .get(`/healthFacilities/getAllOfDistrict/${districtId}`)
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async getAll() {
    return await api()
      .get('/healthFacilities/getall')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async getByProvince(provinceId: any) {
    return await api()
      .get(`/healthFacilities/getAllOfProvince/${provinceId}`)
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createHealthFacilityFromDTO(dto);
      healthFacilityRepo.save(entity);
    });
  },
  deleteAllFromStorage() {
    healthFacilityRepo.flush();
  },
  piniaGetAll() {
    return healthFacilityRepo
      .query()
      .withAllRecursive(2)
      .orderBy('healthFacility', 'asc')
      .get();
  },
  getAllOfDistrict(districtId: any) {
    return healthFacilityRepo
      .query()
      .with('district')
      .where('districtId', districtId)
      .get();
  },
  getByHealthFacility(healthFacility: any) {
    return healthFacilityRepo
      .query()
      .with('district')
      .where('healthFacility', healthFacility)
      .first();
  },
  async saveHealthFacility(healthFacility: any) {
    return await api()
      .post('/healthFacilities/save', healthFacility)
      .then((resp) => {
        healthFacilityRepo.save(createHealthFacilityFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async deleteHealthFacility(healthFacilityId: number) {
    try {
      const resp = await api().patch(`/healthFacilities/${healthFacilityId}`);
      healthFacilityRepo.save(createHealthFacilityFromDTO(resp.data));
      return resp;
    } catch (error: any) {
      console.error('Error', error.message);
      // You might want to re-throw the error or handle it differently here
      throw error;
    }
  },
};
