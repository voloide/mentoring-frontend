import Employee from "src/stores/model/employee/Employee";
import useProfessionalCategory from 'src/composables/professionalCategory/professionalCategoryMethods'
import useLocation from "../location/locationMethods";

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
            locations: createLocation(employeeDTO.locationDTOSet),
            professionalCategory: createProfessionalCategoryFromDTO(employeeDTO.professionalCategoryDTO)
          })
    }

    function createLocation(locationDTOS: any) {
        const { createLocationFromDTO } = useLocation();
        const generatedLocations = []
        locationDTOS.forEach(location => {
            generatedLocations.push(createLocationFromDTO(location));
        });
        return generatedLocations;
    }

    return {
        fullName,
        createEmployeeFromDTO,
    }
}