import Question from "src/stores/model/question/Question";
import useQuestionType from './questionTypeMethods';
import useQuestionCategory from './questionCategoryMethods';
import useResponseType from './responseTypeMethods'

export default function useQuestion() {

    function createQuestionFromDTO(questionDTO: any) {
      const { createQuestionTypeFromDTO } = useQuestionType();
      const { createQuestionCategoryFromDTO } = useQuestionCategory();
      const { createResponseTypeFromDTO } = useResponseType();
        return  new Question({
            id: questionDTO.id,
            uuid: questionDTO.uuid,
            code: questionDTO.code,
            question: questionDTO.question,
            questionType: createQuestionTypeFromDTO(questionDTO.questionType),
            questionCategory: createQuestionCategoryFromDTO(questionDTO.questionCategory),
            responseType: createResponseTypeFromDTO(questionDTO.responseType),
          })
    }

    function createDTOFromQuestion(question: Question) {
      const { createDTOFromQuestionType } = useQuestionType();
      const { createDTOFromQuestionCategory } = useQuestionCategory();
      const { createDTOFromResponseType } = useResponseType();
        const questionDTO = {
            id: question.id,
            uuid: question.uuid,
            code: question.code,
            description: question.description,
            questionTypeDTO: createDTOFromQuestionType(question.questionType),
            questionCategoryDTO: createDTOFromQuestionCategory(question.questionCategory),
            responseType: createDTOFromResponseType(question.responseType),
          }
        return  questionDTO;
    }

    return {
        createQuestionFromDTO,
        createDTOFromQuestion,
      };
}