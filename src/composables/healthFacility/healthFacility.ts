import HealthFacility from "src/stores/model/healthfacility/HealthFacility";
import useDistrict from "../district/districtMethods";

export default function useHealthFacility() {
    
    function createHealthFacilityFromDTO(healthFacilityDTO: any) {
        const { createDistrictFromDTO } = useDistrict();
        return  new HealthFacility({
            id: healthFacilityDTO.id,
            uuid: healthFacilityDTO.uuid,
            healthFacility: healthFacilityDTO.healthFacility,
            district: createDistrictFromDTO(healthFacilityDTO.districtDTO)
          })
    }

    return {
        createHealthFacilityFromDTO,
    }
}