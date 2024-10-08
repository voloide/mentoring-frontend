import FormSection from 'src/stores/model/form/FormSection';
import useSection from 'src/composables/section/sectionMethods';
import useForm from 'src/composables/form/formMethods';
import useFormQuestion from './formQuestionMethods';

export default function useFormSection() {

  function createFormSectionFromDTO(formSectionDTO) {
    const { createSectionFromDTO } = useSection();
    const { createFormFromDTO } = useForm();
    
    const formSection = new FormSection({
      id: formSectionDTO.id,
      uuid: formSectionDTO.uuid,
      sequence: formSectionDTO.sequence,
      section: createSectionFromDTO(formSectionDTO.section),
      formQuestions: createFormQuestionsListFromDTOs(formSectionDTO.formQuestions),
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
      section: createDTOFromSection(formSection.section),
      formQuestions: createDTOsListFromFormQuestions(formSection.formQuestions), // Handling form questions
    };
    return formSectionDTO;
  }

  function createFormQuestionsListFromDTOs(formQuestionDTOS: any) {
    const { createFormQuestionFromDTO } = useFormQuestion();
    const generatedFormQuestions = [];
    formQuestionDTOS.forEach((formQuestionDTO) => {
      const formQuestion = createFormQuestionFromDTO(formQuestionDTO);
      generatedFormQuestions.push(formQuestion);
    });
    return generatedFormQuestions;
  }

  function createDTOsListFromFormQuestions(formQuestions: any) {
    const { createDTOFromFormQuestion } = useFormQuestion();
    const generatedFormQuestions = [];
    formQuestions.forEach((formQuestion) => {
      const formQuestionDTO = createDTOFromFormQuestion(formQuestion);
      generatedFormQuestions.push(formQuestionDTO);
    });
    return generatedFormQuestions;
  }

  return {
    createFormSectionFromDTO,
    createDTOFromFormSection,
  };
}
