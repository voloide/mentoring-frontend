import Location from 'src/stores/model/location/Location';
import useDistrict from '../district/districtMethods';
import useProvince from '../province/provinceMethods';
import useHealthFacility from '../healthFacility/healthFacility';
import locationService from 'src/services/api/location/locationService';

export default function useLocation() {
  function createLocationFromDTO(locationDTO: any) {
    const { createDistrictFromDTO } = useDistrict();
    const { createProvinceFromDTO } = useProvince();
    const { createHealthFacilityFromDTO } = useHealthFacility();

    return new Location({
      id: locationDTO.id,
      uuid: locationDTO.uuid,
      locationLevel: locationDTO.locationLevel,
      district: locationDTO.districtDTO
        ? createDistrictFromDTO(locationDTO.districtDTO)
        : '',
      healthFacility: locationDTO.healthFacilityDTO
        ? createHealthFacilityFromDTO(locationDTO.healthFacilityDTO)
        : '',
      province: locationDTO.provinceDTO
        ? createProvinceFromDTO(locationDTO.provinceDTO)
        : '',
    });
  }

  function createDTOFromLocation(location: any) {
    const { createDTOFromDistrict } = useDistrict();
    const { createDTOFromProvince } = useProvince();
    const { createDTOFromHealthFacility } = useHealthFacility();

    const locationDTO = {
      id: location.id,
      uuid: location.uuid,
      locationLevel: location.locationLevel,
      districtDTO: location.district
        ? createDTOFromDistrict(location.district)
        : undefined,
      healthFacilityDTO: location.healthFacility
        ? createDTOFromHealthFacility(location.healthFacility)
        : undefined,
      provinceDTO: location.province
        ? createDTOFromProvince(location?.province)
        : undefined,
    };
    return locationDTO;
  }

  return {
    createLocationFromDTO,
    createDTOFromLocation,
  };
}
