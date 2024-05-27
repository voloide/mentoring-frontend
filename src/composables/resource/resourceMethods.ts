import Resource from "src/stores/model/resource/Resource";

export default function useResource() {

    function createResourceFromDTO(resourceDTO: any) {
      return  new Resource({
          id: resourceDTO.id,
          uuid: resourceDTO.uuid,
          resource: resourceDTO.resource,
        })
    }

    // function createDTOFromResource(resource: Resource | null, file = null) {
    //     const resourceDTO = {
    //       id: resource?.id,
    //       uuid: resource?.uuid,
    //       resource: resource?.resource,
    //       file: file
    //     }
    //     return  resourceDTO;
    // }

    function createDTOFromResource(resource: Resource) {
        return {
            id: resource?.id,
            uuid: resource?.uuid,
            resource: resource?.resource,
        };
    }

    return {
      createResourceFromDTO,
      createDTOFromResource,
    };
}
