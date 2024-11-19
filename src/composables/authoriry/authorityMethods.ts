import Authority from 'src/stores/model/authority/Authority'

export default function useAuthority() {
    
    function createAuthorityFromDTO(authorityDTO) {
        return  new Authority({
            id: authorityDTO.id,
            uuid: authorityDTO.uuid,
            code: authorityDTO.code,
            description: authorityDTO.description,
            module: authorityDTO.module,
          })
    }

    return {
        createAuthorityFromDTO,
    }
}