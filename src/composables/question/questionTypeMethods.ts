import QuestionType from "src/stores/model/question/QuestionType";

export default function useQuestionType() {

    function createQuestionTypeFromDTO(questionTypeDTO: any) {
        return  new QuestionType({
            id: questionTypeDTO.id,
            uuid: questionTypeDTO.uuid,
            code: questionTypeDTO.code,
            description: questionTypeDTO.description,
          })
    }

    function createDTOFromQuestionType(questionType: QuestionType) {
        const questionTypeDTO = {
            id: questionType.id,
            uuid: questionType.uuid,
            code: questionType.code,
            description: questionType.description,
          }
        return  questionTypeDTO;
    }

    return {
        createQuestionTypeFromDTO,
        createDTOFromQuestionType,
      };
}