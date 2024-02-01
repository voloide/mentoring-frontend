import District from "src/stores/model/location/District";
import useProvince from "../province/provinceMethods";

export default function useDistrict() {
    
    function createDistrictFromDTO(districtDTO: any) {
        const { createProvinceFromDTO } = useProvince();
        return  new District({
            id: districtDTO.id,
            uuid: districtDTO.uuid,
            district: districtDTO.district,
            province: createProvinceFromDTO(districtDTO.provinceDTO)
          })
    }

    return {
        createDistrictFromDTO,
    }
}