import Partner from "src/stores/model/partner/Partner";

export default function usePartner() {
    
    function createPartnerFromDTO(partnerDTO: any) {
        return  new Partner({
            id: partnerDTO.id,
            uuid: partnerDTO.uuid,
            description: partnerDTO.description,
            name: partnerDTO.name,
          })
    }

    function createDTOFromPartner(partner: Partner) {
        const partnerDTO = {
            id: partner.id,
            uuid: partner.uuid,
            description: partner.description,
            name: partner.name,
          }
        return  partnerDTO;
    }

    return {
        createPartnerFromDTO,
        createDTOFromPartner,
    }
}