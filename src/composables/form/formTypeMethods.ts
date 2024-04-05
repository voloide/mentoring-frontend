import FormType from "src/stores/model/form/FormType";

export default function useFormType() {

    function createFormTypeFromDTO(formTypeDTO: any) {
        return  new FormType({
            id: formTypeDTO.id,
            uuid: formTypeDTO.uuid,
            code: formTypeDTO.code,
            description: formTypeDTO.description,
          })
    }

    function createDTOFromFormType(formType: FormType) {
        const formTypeDTO = {
            id: formType.id,
            uuid: formType.uuid,
            code: formType.code,
            description: formType.description,
          }
        return  formTypeDTO;
    }

    return {
        createFormTypeFromDTO,
        createDTOFromFormType,
      };
}