import FormSection from 'src/stores/model/form/FormSection';
import useSection from 'src/composables/section/sectionMethods';
import useForm from 'src/composables/form/formMethods';

export default function useFormSection() {

  function createFormSectionFromDTO(formSectionDTO) {
    const { createSectionFromDTO } = useSection();
    const { createFormFromDTO } = useForm();
    
    const formSection = new FormSection({
      id: formSectionDTO.id,
      uuid: formSectionDTO.uuid,
      sequence: formSectionDTO.sequence,
      //form: createFormFromDTO(formSectionDTO.form),
      section: createSectionFromDTO(formSectionDTO.section),
    });
    return formSection;
  }

  function createDTOFromFormSection(formSection) {
    const { createDTOFromSection } = useSection();
    const { createDTOFromForm } = useForm();
    
    const formSectionDTO = {
      id: formSection.id,
      uuid: formSection.uuid,
      sequence: formSection.sequence,
      //form: createDTOFromForm(formSection.form),
      section: createDTOFromSection(formSection.section),
    };
    return formSectionDTO;
  }

  return {
    createFormSectionFromDTO,
    createDTOFromFormSection,
  };
}
