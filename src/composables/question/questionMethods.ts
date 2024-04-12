import Question from "src/stores/model/question/Question";
import useQuestionCategory from './questionCategoryMethods';

export default function useQuestion() {

    function createQuestionFromDTO(questionDTO: any) {
      const { createQuestionCategoryFromDTO } = useQuestionCategory();
        return  new Question({
            id: questionDTO.id,
            uuid: questionDTO.uuid,
            code: questionDTO.code,
            question: questionDTO.question,
            questionCategory: createQuestionCategoryFromDTO(questionDTO.questionCategory),
          })
    }

    function createDTOFromQuestion(question: Question) {
      const { createDTOFromQuestionCategory } = useQuestionCategory();
        const questionDTO = {
            id: question.id,
            uuid: question.uuid,
            code: question.code,
            description: question.description,
            questionCategoryDTO: createDTOFromQuestionCategory(question.questionCategory),
          }
        return  questionDTO;
    }

    return {
        createQuestionFromDTO,
        createDTOFromQuestion,
      };
}