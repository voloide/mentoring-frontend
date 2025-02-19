import EvaluationLocation from "src/stores/model/question/EvaluationLocation";

export default function useEvaluationLocation() {

    function createEvaluationLocationFromDTO(evaluationLocationDTO: any) {
      console.log(evaluationLocationDTO)
      return  new EvaluationLocation({
          uuid: evaluationLocationDTO.uuid,
          code: evaluationLocationDTO.code,
          description: evaluationLocationDTO.description,
        })
    }

    function createDTOFromEvaluationLocation(evaluationLocation: EvaluationLocation) {
        const evaluationLocationDTO = {
            uuid: evaluationLocation.uuid,
            code: evaluationLocation.code,
            description: evaluationLocation.description,
          }
        return  evaluationLocationDTO;
    }

    return {
        createEvaluationLocationFromDTO,
        createDTOFromEvaluationLocation,
      };
}