import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import Form from 'src/stores/model/form/Form';
import useForm from 'src/composables/form/formMethods';

const repo = useRepo(Form);
const { createFormFromDTO }  = useForm();

export default {
    async search(searchParam: string) {
        return await api()
          .get(`/forms/search?${new URLSearchParams(searchParam).toString()}`)
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      async saveOrUpdate(formDTO: any) {
          let resp = null;
          resp = await api()
          .post(`/forms/saveOrUpdate`, formDTO)
          .then((resp) => {
            this.generateAndSaveEntityFromDTO(resp.data);
            this.update(formDTO);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
          return resp;
      },
      async changeLifeCycleStatus(formDTO: any) {
        let resp = null;
        resp = await api()
        .post(`/forms/changeLifeCicleStatus`, formDTO)
        .then((resp) => {
          return resp;
        })
        .catch((error) => {
          console.log('Error', error.message);
        });
        return resp;
    },
      generateAndSaveEntityFromDTO(dtoList: any) {
        dtoList.forEach((dto) => {
          const entity = createFormFromDTO(dto);
          repo.save(entity);
        });
      },
      deleteAllFromStorage() {
        repo.flush();
      },
      piniaGetAll() {
        return repo.query().orderBy('description', 'asc').get();
      },
      getFormList() {
        return repo
                      .query()
                      .withAllRecursive(2)
                      .orderBy('id', 'asc')
                      .get();
      },
      getById(id: number) {
        return repo
                      .query()
                      .withAllRecursive(2)
                      .where('id', id)
                      .orderBy('id', 'asc')
                      .first();
      },
      update(form: any) {
        repo.save(form);
      },
}