import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import Resource from 'src/stores/model/resource/Resource';
import useResource from 'src/composables/resource/resourceMethods';
import { handleError } from 'vue';

const repo = useRepo(Resource);
const { createResourceFromDTO } = useResource();

export default {
  async getAll() {
    return await api()
      .get('/resources/getAll')
      .then((resp) => {
        this.generateAndSaveEntityFromDTO(resp.data);
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
  },
  async save(resource: any) {
    return await api()
      .post('/resources/save', resource)
      .then((resp) => {
        repo.save(createResourceFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error);
        return error;
      });
  },
  async updateResourceTree(resourceDTO: any) {
    let resp = null;
    resp = await api()
      .patch('/resources/updateresourcetree', resourceDTO)
      .then((resp) => {
        repo.save(createResourceFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
    return resp;
  },
  async updateResourceTreeWithoutFile(resourceDTO: any) {
    let resp = null;
    resp = await api()
      .patch('/resources/updateresourcetreewithoutfile', resourceDTO)
      .then((resp) => {
        repo.save(createResourceFromDTO(resp.data));
        return resp;
      })
      .catch((error) => {
        console.error('Error', error.message);
      });
    return resp;
  },
  saveFileLocally(file: any) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  },

  async loadFile(fileName: string) {
    let responseStatus = null;
    const resp = await api()
      .get('/resources/load', {
        responseType: 'blob',
        params: { fileName },
      })
      .then((resp) => {
        responseStatus = resp.status;
        if (resp.status === 200) {
          const url = window.URL.createObjectURL(resp.data);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
        return resp;
      })
      .catch((error) => {
        responseStatus = error.response.status;
      });
    return responseStatus;
  },

  getResourceList() {
    return repo.query().withAllRecursive(2).orderBy('id', 'asc').get();
  },
  getById(id: any) {
    return repo
      .query()
      .withAllRecursive(2)
      .where('id', id)
      .orderBy('id', 'asc')
      .first();
  },
  generateAndSaveEntityFromDTO(dtoList: any) {
    dtoList.forEach((dto: any) => {
      const entity = createResourceFromDTO(dto);
      repo.save(entity);
    });
  },
  deleteAllFromStorage() {
    repo.flush();
  },
  piniaGetAll() {
    const resources = repo.query().orderBy('id', 'asc').get();
    return resources;
  },
};
