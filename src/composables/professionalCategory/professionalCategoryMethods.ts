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

    function createDTOFromProfessionalCategory(professionalCategory: ProfessionalCategory) {
        const professionalCategoryDTO = {
            id: professionalCategory.id,
            uuid: professionalCategory.uuid,
            code: professionalCategory.code,
            description: professionalCategory.description,
          }
        return  professionalCategoryDTO;
    }

    return {
        createProfessionalCategoryFromDTO,
        createDTOFromProfessionalCategory
    }
}
