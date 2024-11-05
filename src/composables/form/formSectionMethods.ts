import FormSection from 'src/stores/model/form/FormSection';
import useSection from 'src/composables/section/sectionMethods';
import useForm from 'src/composables/form/formMethods';
import useFormSectionQuestion from './formSectionQuestionMethods';

export default function useFormSection() {

  function createFormSectionFromDTO(formSectionDTO) {
    const { createSectionFromDTO } = useSection();
    const { createFormFromDTO } = useForm();

    const formSection = new FormSection({
      id: formSectionDTO.id,
      uuid: formSectionDTO.uuid,
      sequence: formSectionDTO.sequence,
      in_use: formSectionDTO.in_use,
      section: createSectionFromDTO(formSectionDTO.section),
      formSectionQuestions: formSectionDTO.formSectionQuestions ? createFormQuestionsListFromDTOs(formSectionDTO.formSectionQuestions) : [],
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
      formSectionQuestions: createDTOsListFromFormQuestions(formSection.formSectionQuestions), // Handling form questions
    };
    return formSectionDTO;
  }

  function createFormQuestionsListFromDTOs(formQuestionDTOS: any) {
    const { createFormSectionQuestionFromDTO } = useFormSectionQuestion();
    const generatedFormQuestions = [];
    formQuestionDTOS.forEach((formQuestionDTO) => {
      const formQuestion = createFormSectionQuestionFromDTO(formQuestionDTO);
      generatedFormQuestions.push(formQuestion);
    });
    return generatedFormQuestions;

    // return []
  }

  function createDTOsListFromFormQuestions(formQuestions: any) {
    const { createDTOFromFormSectionQuestion } = useFormSectionQuestion();
    const generatedFormQuestions = [];
    formQuestions.forEach((formQuestion) => {
      const formQuestionDTO = createDTOFromFormSectionQuestion(formQuestion);
      generatedFormQuestions.push(formQuestionDTO);
    });
    return generatedFormQuestions;
  }

  return {
    createFormSectionFromDTO,
    createDTOFromFormSection,
  };
}
