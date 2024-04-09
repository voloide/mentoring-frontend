import Form from "src/stores/model/form/Form";
import useProgrammaticArea from "src/composables/programmaticArea/programmaticAreaMethods";
import useFormType from "./formTypeMethods";
import useFormQuestion from "./formQuestionMethods";
import usePartner from "src/composables/partner/partnerMethods";

export default function useForm() {

    function createFormFromDTO(formDTO: any) {
      const { createProgrammaticAreaFromDTO } = useProgrammaticArea();
      const { createPartnerFromDTO } = usePartner();
        return  new Form({
            id: formDTO.id,
            uuid: formDTO.uuid,
            code: formDTO.code,
            name: formDTO.name,
            description: formDTO.description,
            targetPatient: formDTO.targetPatient,
            targetFile: formDTO.targetFile,
            programmaticArea: createProgrammaticAreaFromDTO(formDTO.programmaticArea),
            partner: createPartnerFromDTO(formDTO.partner),
            //formQuestions: createFormQuestionsListFromDTOs(formDTO.formQuestions),
          })
    }

    function createDTOFromForm(form: Form) {
      const { createDTOFromProgrammaticArea } = useProgrammaticArea();
      const { createDTOFromPartner } = usePartner();
        const formDTO = {
          id: form.id,
          uuid: form.uuid,
          code: form.code,
          name: form.name,
          description: form.description,
          targetPatient: form.targetPatient,
          targetFile: form.targetFile,
          programmaticAreaDTO: createDTOFromProgrammaticArea(form.programmaticArea),
          partnerDTO: createDTOFromPartner(form.partner),
          //formQuestions: createDTOsListFromFormQuestions(form.formQuestions),
          }
        return  formDTO;
    }

    function createFormQuestionsListFromDTOs(formQuestionDTOS: any) {
      const { createDTOFromFormQuestion } = useFormQuestion();
      const generatedFormQuestions = [];
      formQuestionDTOS.forEach((formQuestionDTO) => {
        const formQuestion = createDTOFromFormQuestion(formQuestionDTO)
        generatedFormQuestions.push(formQuestion);
      });
      return generatedFormQuestions;
    }
  
    function createDTOsListFromFormQuestions(formQuestions: any) {
      const { createFormQuestionFromDTO } = useFormQuestion();
      const generatedFormQuestions = [];
      formQuestions.forEach((formQuestion) => {
        const formQuestionDTO = createFormQuestionFromDTO(formQuestion)
        generatedFormQuestions.push(formQuestionDTO);
      });
      return generatedFormQuestions;
    }

    return {
        createFormFromDTO,
        createDTOFromForm,
      };
}