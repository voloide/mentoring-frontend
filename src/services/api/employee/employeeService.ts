import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import Employee from 'src/stores/model/employee/Employee';
import useMentor from "src/composables/mentor/mentorMethods"
const employeeRepo = useRepo(Employee);

export default {
  getById(id: number) {
    return employeeRepo
      .query()
      .withAllRecursive(2)
      .where('id', id)
      .orderBy('id', 'asc')
      .first();
  },

  verifyExistance(nuitParam: string) {
    const trimmedNuitParam = nuitParam.trim();
    const parsedNuitParam = parseInt(trimmedNuitParam, 10);
    const employee = employeeRepo
        .query()
        .withAllRecursive(2)
        .where('nuit', parsedNuitParam)
        .first();

    return !!employee;
  }


};

