import District from "src/stores/model/location/District";
import useProvince from "../province/provinceMethods";

export default function useDistrict() {

    function createDistrictFromDTO(districtDTO: any) {
        const { createProvinceFromDTO } = useProvince();
        return  new District({
            id: districtDTO.id,
            uuid: districtDTO.uuid,
            description: districtDTO.description,
            province: (districtDTO.provinceDTO !== undefined && districtDTO.provinceDTO !== null) ? createProvinceFromDTO(districtDTO.provinceDTO) : null
          })
    }

    function createDTOFromDistrict(district: any) {
        const { createDTOFromProvince } = useProvince();
        const districtDTO = {
            id: district?.id,
            uuid: district?.uuid,
            description: district?.description,
            provinceDTO: (district?.province !== undefined && district?.province !== null) ? createDTOFromProvince(district?.province) : null

        }
        return  districtDTO;
    }

    return {
        createDistrictFromDTO,
        createDTOFromDistrict
    }
}
