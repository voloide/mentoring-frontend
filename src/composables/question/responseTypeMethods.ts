import ResponseType from "src/stores/model/question/ResponseType";

export default function useResponseType() {

    function createResponseTypeFromDTO(respoonseTypeDTO: any) {
        return  new ResponseType({
            id: respoonseTypeDTO.id,
            uuid: respoonseTypeDTO.uuid,
            code: respoonseTypeDTO.code,
            description: respoonseTypeDTO.description,
          })
    }

    function createDTOFromResponseType(responseType: ResponseType) {
        const respoonseTypeDTO = {
            id: responseType.id,
            uuid: responseType.uuid,
            code: responseType.code,
            description: responseType.description,
          }
        return  respoonseTypeDTO;
    }

    return {
        createResponseTypeFromDTO,
        createDTOFromResponseType,
      };
}