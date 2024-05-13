import useRole from 'src/composables/role/roleMethods'
import useEmployee from '../employee/employeeMethods';
import TutorProgrammaticArea from 'src/stores/model/TutorProgrammaticArea/TutorProgrammaticArea'

export default function useTutorEmployee() {

    function createTutorProgrammaticAreaFromDTO(tutorProgramaticArea: any, tutor: any) {
        const { createEmployeeFromDTO } = useEmployee();
        return new TutorProgrammaticArea({
            id: tutorProgramaticArea.id,
            uuid: tutorProgramaticArea.uuid,
            employee: createEmployeeFromDTO(tutorProgramaticArea.employeeDTO)
          });
    }

    return {
        createTutorProgrammaticAreaFromDTO,
    }
}