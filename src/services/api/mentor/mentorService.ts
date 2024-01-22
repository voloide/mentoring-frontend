import api from '../apiService/apiService';
import { useRepo } from 'pinia-orm';
import { UserDTO } from 'src/services/dto/user/UserDTO';
import { plainToClass } from 'class-transformer';
import Mentor from 'src/stores/model/mentor/Mentor';
import Employee from 'src/stores/model/employee/Employee';
import ProfessionalCategory from 'src/stores/model/professionalCategory/ProfessionalCategory';

const mentorRepo = useRepo(Mentor);

export default {

    async search(searchParam: string) {
        console.log(new URLSearchParams(searchParam).toString());
        return await api()
          .get(`/mentor/search?${new URLSearchParams(searchParam).toString()}`)
          .then((resp) => {
            this.deleteAllFromStorage()
            this.generateAndSaveMentorsFromDTO(resp.data);
            return resp;
          })
          .catch((error) => {
            console.log('Error', error.message);
          });
      },
      generateAndSaveMentorsFromDTO(mentorList: any) {
        mentorList.forEach(mentorDTO => {
          const mentor = new Mentor({
            id: mentorDTO.id,
            uuid: mentorDTO.uuid,
            employee: new Employee({
              id: mentorDTO.employeeDTO.id,
              uuid: mentorDTO.employeeDTO.uuid,
              name: mentorDTO.employeeDTO.name,
              surname: mentorDTO.employeeDTO.surname,
              nuit: mentorDTO.employeeDTO.nuit,
              email: mentorDTO.employeeDTO.email,
              trainingYear: mentorDTO.employeeDTO.trainingYear,
              phoneNumber: mentorDTO.employeeDTO.phoneNumber,
              professionalCategory: new ProfessionalCategory({
                id: mentorDTO.employeeDTO.professionalCategoryDTO.id,
                uuid: mentorDTO.employeeDTO.professionalCategoryDTO.uuid,
                code: mentorDTO.employeeDTO.professionalCategoryDTO.code,
                description: mentorDTO.employeeDTO.professionalCategoryDTO.description,
              })
            })
          });
          console.log(mentor);
          mentorRepo.save(mentor);
        });

      },
      deleteAllFromStorage() {
        mentorRepo.flush();
      },
      getMentorList() {
        return mentorRepo
          .query()
          .withAllRecursive(2)
          .orderBy('id', 'asc')
          .get();
      }

};