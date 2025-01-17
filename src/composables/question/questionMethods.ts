import Question from 'src/stores/model/question/Question';
import useProgram from '../program/programMethods';
import useEvaluationLocation from './evaluationLocationMethods';

export default function useQuestion() {
  const {createEvaluationLocationFromDTO, createDTOFromEvaluationLocation} = useEvaluationLocation();
    function createQuestionFromDTO(questionDTO) {
      
      const { createProgramFromDTO } = useProgram();
        return  new Question({
            id: questionDTO.id,
            uuid: questionDTO.uuid,
            code: questionDTO.code,
            tableCode: questionDTO.tableCode,
            lifeCycleStatus: questionDTO.lifeCycleStatus,
            used_in_form_section: questionDTO.used_in_form_section,
            question: questionDTO.question,
            program: createProgramFromDTO(questionDTO.program),
            evaluationLocation: createEvaluationLocationFromDTO(questionDTO.evaluationLocationDTO)
          })
    }

    function createDTOFromQuestion(question: Question) {
      const { createDTOFromProgram } = useProgram();
        const questionDTO = {
            id: question.id,
            uuid: question.uuid,
            code: question.code,
            tableCode: question.tableCode,
            question: question.question,
            lifeCycleStatus: question.lifeCycleStatus,
            used_in_form_section: question.used_in_form_section,
            program: createDTOFromProgram(question.program),
            evaluationLocationDTO: createDTOFromEvaluationLocation(question.evaluationLocation)
          }
        return  questionDTO;
    }

    return {
        createQuestionFromDTO,
        createDTOFromQuestion,
      };
}
