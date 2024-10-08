import Question from 'src/stores/model/question/Question';
import useProgram from '../program/programMethods';

export default function useQuestion() {

    function createQuestionFromDTO(questionDTO) {
      const { createProgramFromDTO } = useProgram();
        return  new Question({
            id: questionDTO.id,
            uuid: questionDTO.uuid,
            code: questionDTO.code,
            tableCode: questionDTO.tableCode,
            question: questionDTO.question,
            program: createProgramFromDTO(questionDTO.program),
          })
    }

    function createDTOFromQuestion(question: Question) {
      const { createDTOFromProgram } = useProgram();
        const questionDTO = {
            id: question.id,
            uuid: question.uuid,
            code: question.code,
            tableCode: question.tableCode,
            description: question.description,
            program: createDTOFromProgram(question.program),
          }
        return  questionDTO;
    }

    return {
        createQuestionFromDTO,
        createDTOFromQuestion,
      };
}