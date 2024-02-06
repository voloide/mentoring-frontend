import Province from "src/stores/model/location/Province";

export default function useProvince() {
    
    function createProvinceFromDTO(provinceDTO: any) {
        return  new Province({
            id: provinceDTO.id,
            uuid: provinceDTO.uuid,
            designation: provinceDTO.designation,
          })
    }

    function createDTOFromProvince(province: Province) {
        const provinceDTO = {
            id: province.id,
            uuid: province.uuid,
            designation: province.designation,
          }
        return  provinceDTO;
    }

    return {
        createProvinceFromDTO,
        createDTOFromProvince
    }
}