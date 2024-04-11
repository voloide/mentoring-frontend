import FormQuestion from "src/stores/model/form/FormQuestion";
import useQuestion from "src/composables/question/questionMethods";
import useEvaluationType from 'src/composables/question/evaluationTypeMethods';
import useResponseType from 'src/composables/question/responseTypeMethods';

export default function useFormQuestion() {

    function createFormQuestionFromDTO(formQuestionDTO: any) {
      const { createQuestionFromDTO } = useQuestion();
      const { createEvaluationTypeFromDTO } = useEvaluationType();
      const { createResponseTypeFromDTO } = useResponseType();
      const formQuestion = new FormQuestion({
        id: formQuestionDTO.id,
        uuid: formQuestionDTO.uuid,
        mandatory: formQuestionDTO.mandatory,
        sequence: formQuestionDTO.sequence,
        applicable: formQuestionDTO.applicable,
        createdAt: formQuestionDTO.createdAt,
        createdBy: formQuestionDTO.createdBy,
        question: createQuestionFromDTO(formQuestionDTO.question),
        evaluationType: createEvaluationTypeFromDTO(formQuestionDTO.evaluationType),
        responseType: createResponseTypeFromDTO(formQuestionDTO.responseType),
        });
        return formQuestion;
    }

    function createDTOFromFormQuestion(formQuestion: FormQuestion) {
      const { createDTOFromQuestion } = useQuestion();
      const { createDTOFromEvaluationType } = useEvaluationType();
      const { createDTOFromResponseType } = useResponseType();
        const formQuestionDTO = {
            id: formQuestion.id,
            uuid: formQuestion.uuid,
            mandatory: formQuestion.mandatory,
            sequence: formQuestion.sequence,
            applicable: formQuestion.applicable,
            createdAt: formQuestion.createdAt,
            createdBy: formQuestion.createdBy,
            questionDTO: createDTOFromQuestion(formQuestion.question),
            evaluationType: createDTOFromEvaluationType(formQuestion.evaluationType),
            responseType: createDTOFromResponseType(formQuestion.responseType),
          }
        return  formQuestionDTO;
    }

    return {
        createFormQuestionFromDTO,
        createDTOFromFormQuestion,
      };
}