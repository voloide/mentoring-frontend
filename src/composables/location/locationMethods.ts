import Location from "src/stores/model/location/Location";
import useDistrict from "../district/districtMethods";
import useProvince from "../province/provinceMethods";
import useHealthFacility from "../healthFacility/healthFacility";

export default function useLocation() {
    function createLocationFromDTO(locationDTO: any) {
        const { createDistrictFromDTO } = useDistrict();
        const { createProvinceFromDTO } = useProvince();
        const { createHealthFacilityFromDTO } = useHealthFacility();

        return new Location({
            id: locationDTO.id,
            uuid: locationDTO.uuid,
            locationLevel: locationDTO.healthFacilityDTO,
            district: createDistrictFromDTO(locationDTO.districtDTO),
            healthFacility: createHealthFacilityFromDTO(locationDTO.healthFacilityDTO),
            province: createProvinceFromDTO(locationDTO.provinceDTO),
          })
    }

    return {
        createLocationFromDTO
    }
}