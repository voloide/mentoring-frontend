import ProfessionalCategory from "src/stores/model/professionalCategory/ProfessionalCategory";

export default function useProfessionalCategory() {
    
    function createProfessionalCategoryFromDTO(professionalCategoryDTO: any) {
        return  new ProfessionalCategory({
            id: professionalCategoryDTO.id,
            uuid: professionalCategoryDTO.uuid,
            code: professionalCategoryDTO.code,
            description: professionalCategoryDTO.description,
          })
    }

    return {
        createProfessionalCategoryFromDTO,
    }
}