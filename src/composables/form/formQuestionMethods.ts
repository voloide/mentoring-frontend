import FormQuestion from "src/stores/model/form/FormQuestion";
import useQuestion from "src/composables/question/questionMethods";

export default function useFormQuestion() {

    function createFormQuestionFromDTO(formQuestionDTO: any) {
      const { createQuestionFromDTO } = useQuestion();
      const formQuestion = new FormQuestion({
        id: formQuestionDTO.id,
        uuid: formQuestionDTO.uuid,
        mandatory: formQuestionDTO.mandatory,
        sequence: formQuestionDTO.sequence,
        applicable: formQuestionDTO.applicable,
        question: createQuestionFromDTO(formQuestionDTO.question),
        });
        return formQuestion;
    }

    function createDTOFromFormQuestion(formQuestion: FormQuestion) {
      const { createDTOFromQuestion } = useQuestion();
        const formQuestionDTO = {
            id: formQuestion.id,
            uuid: formQuestion.uuid,
            mandatory: formQuestion.mandatory,
            sequence: formQuestion.sequence,
            applicable: formQuestion.applicable,
            questionDTO: createDTOFromQuestion(formQuestion.question),
          }
        return  formQuestionDTO;
    }

    return {
        createFormQuestionFromDTO,
        createDTOFromFormQuestion,
      };
}