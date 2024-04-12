import EvaluationType from "src/stores/model/question/EvaluationType";

export default function useEvaluationType() {

    function createEvaluationTypeFromDTO(evaluationTypeDTO: any) {
        return  new EvaluationType({
            id: evaluationTypeDTO.id,
            uuid: evaluationTypeDTO.uuid,
            code: evaluationTypeDTO.code,
            description: evaluationTypeDTO.description,
          })
    }

    function createDTOFromEvaluationType(evaluationType: EvaluationType) {
        const evaluationTypeDTO = {
            id: evaluationType.id,
            uuid: evaluationType.uuid,
            code: evaluationType.code,
            description: evaluationType.description,
          }
        return  evaluationTypeDTO;
    }

    return {
        createEvaluationTypeFromDTO,
        createDTOFromEvaluationType,
      };
}