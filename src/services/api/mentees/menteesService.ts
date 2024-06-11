import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import userMentees from 'src/composables/mentees/menteesMethods';

import Mentees from 'src/stores/model/mentees/Mentees';

const menteesRepo = useRepo(Mentees);
const { createMenteesFromDTO } = userMentees();

export default {
  async search(searchParam: string) {
    return await api()
      .get(`/tutored/search?${new URLSearchParams(searchParam).toString()}`)
      .then((resp) => {
        this.generateAndSaveMenteesFromDTO(resp.data);
        return resp;
      });
  },

  async update(mentees: any) {
    return await api()
      .patch('/tutored/update', mentees)
      .then((resp) => {
        menteesRepo.save(createMenteesFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error);
      });
  },
  async getByUuid(uuid: string) {
    return await api()
      .get(`/tutored/${uuid}`)
      .then((resp) => {
        this.generateAndSaveMenteesFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },

  generateAndSaveMenteesFromDTO(menteesList: any) {
    menteesList.forEach((menteesDTO) => {
      const mentorado = createMenteesFromDTO(menteesDTO);
      menteesRepo.save(mentorado);
    });
  },

  deleteAllFromStorage() {
    menteesRepo.flush();
  },
  getMenteesList() {
    return menteesRepo.query().withAllRecursive(2).orderBy('id', 'asc').get();
  },
  getById(id: number) {
    return menteesRepo
      .query()
      .withAllRecursive(3)
      .where('id', id)
      .orderBy('id', 'asc')
      .first();
  },
};
