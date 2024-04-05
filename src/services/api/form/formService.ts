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
      async saveOrUpdate(searchParam: string, formDTO: any) {
        let resp = null;
        console.log(searchParam);
        console.log(formDTO);
          resp = await api()
          .post(`/forms/saveOrUpdate?${new URLSearchParams(searchParam).toString()}`, formDTO)
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
      }
}