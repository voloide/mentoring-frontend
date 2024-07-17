import ProfessionalCategory from 'src/stores/model/professionalCategory/ProfessionalCategory';

export default function useProfessionalCategory() {
  function createProfessionalCategoryFromDTO(professionalCategoryDTO: any) {
    return new ProfessionalCategory({
      id: professionalCategoryDTO.id,
      uuid: professionalCategoryDTO.uuid,
      code: professionalCategoryDTO.code,
      description: professionalCategoryDTO.description,
      lifeCycleStatus: professionalCategoryDTO.lifeCycleStatus,
    });
  }

  function createDTOFromProfessionalCategory(professionalCategory: any) {
    const professionalCategoryDTO = {
      id: professionalCategory.id,
      uuid: professionalCategory.uuid,
      code: professionalCategory.code,
      description: professionalCategory.description,
      lifeCycleStatus: professionalCategory.lifeCycleStatus,
    };
    return professionalCategoryDTO;
  }

  return {
    createProfessionalCategoryFromDTO,
    createDTOFromProfessionalCategory,
  };
}
