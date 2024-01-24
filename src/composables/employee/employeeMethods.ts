import Employee from "src/stores/model/employee/Employee";
import useProfessionalCategory from 'src/composables/professionalCategory/professionalCategoryMethods'

export default function useEmployee() {
    function fullName(employee: Employee) {
        return `${employee.name} ${employee.surname}`;
    }

    function createEmployeeFromDTO(employeeDTO: any) {
        const { createProfessionalCategoryFromDTO } = useProfessionalCategory();
        return new Employee({
            id: employeeDTO.id,
            uuid: employeeDTO.uuid,
            name: employeeDTO.name,
            surname: employeeDTO.surname,
            nuit: employeeDTO.nuit,
            email: employeeDTO.email,
            trainingYear: employeeDTO.trainingYear,
            phoneNumber: employeeDTO.phoneNumber,
            professionalCategory: createProfessionalCategoryFromDTO(employeeDTO.professionalCategoryDTO)
          })
    }

    return {
        fullName,
        createEmployeeFromDTO,
    }
}