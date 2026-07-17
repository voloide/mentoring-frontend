import useEmployee from '../employee/employeeMethods';
import TutorProgrammaticArea from 'stores/model/tutorProgrammaticArea/TutorProgrammaticArea'

export default function useTutorEmployee() {

    function createTutorProgrammaticAreaFromDTO(tutorProgramaticArea: any) {
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
