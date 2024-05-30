import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import { plainToClass } from 'class-transformer';
import Partner from 'src/stores/model/partner/Partner';
import usePartner from 'src/composables/partner/partnerMethods';

const repo = useRepo(Partner);
const { createPartnerFromDTO } = usePartner();

export default {
  async getAll() {
    return await api()
      .get('/partner/getall')
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
      const entity = createPartnerFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    return repo.query().where((partener) => {
      return partener.uuid !== '398f0ffeb8fe11edafa10242ac120002';
    }).orderBy('description', 'asc').get();
  },
  getByName(name: string) {
    return repo
      .query()
      .where('name', name)
      .orderBy('description', 'asc')
      .first();
  },

  getById(id: string) {
    return repo
      .query()
      .where('id', id)
      .orderBy('description', 'asc')
      .first();
  },
  async savePartner(partner: any) {
    return await api()
      .post('/partner', partner)
      .then((resp) => {
        repo.save(createPartnerFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.log('Error', error.message);
      });
  },
};
