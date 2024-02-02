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
            district: locationDTO.districtDTO !== undefined ? createDistrictFromDTO(locationDTO.districtDTO) : '',
            healthFacility: locationDTO.healthFacilityDTO !== undefined ? createHealthFacilityFromDTO(locationDTO.healthFacilityDTO) : '',
            province: locationDTO.provinceDTO !== undefined ? createProvinceFromDTO(locationDTO.provinceDTO) : '',
          })
    }

    return {
        createLocationFromDTO
    }
}