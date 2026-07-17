import useDistrict from 'src/composables/district/districtMethods';
import useHealthFacility from 'src/composables/healthFacility/healthFacility';
import Ronda from 'stores/model/ronda/Ronda';
import RondaType from 'stores/model/ronda/RondaType';
import RondaMentee from 'stores/model/ronda/RondaMentee';
import employeeService from 'src/services/api/employee/employeeService';
import RondaMentor from 'stores/model/ronda/RondaMentor';
import useMentor from 'src/composables/mentor/mentorMethods';

export default function useRonda() {
  function createRondaFromDTO(rondaDTO: any) {
    return new Ronda({
      id: rondaDTO.id,
      uuid: rondaDTO.uuid,
      description: rondaDTO.description,
      startDate: rondaDTO.startDate,
      endDate: rondaDTO.endDate,
      createdAt: rondaDTO.createdAt,
      ronda_type_id: rondaDTO.rondaTypeDTO.id,
      health_facility_id: rondaDTO.healthFacility.id,
      lifeCycleStatus: rondaDTO.lifeCycleStatus,
      healthFacility: useHealthFacility().createHealthFacilityFromDTO(
        rondaDTO.healthFacility
      ),
      rondaType: createRondaTypeFromDTO(rondaDTO.rondaTypeDTO),
      // rondaMentees: doCreateRondaMenteeFromDTO(rondaDTO),
      rondaMentors: doCreateRondaMentorsFromDTO(rondaDTO),
    });
  }
  function doCreateRondaMentorsFromDTO(ronda: any) {
    const rondaMentorsDTO: RondaMentor[] = [];
    ronda.rondaMentors.forEach((rondaMentor: any) => {
      const rm = createRondaMentorFromDTO(rondaMentor, ronda);
      rondaMentorsDTO.push(rm);
    });
    return rondaMentorsDTO;
  }
  function createDTOFromRonda(ronda: Ronda) {
    const rondaDTO = {
      id: ronda.id,
      uuid: ronda.uuid,
      description: ronda.description,
      startDate: ronda.startDate,
      endDate: ronda.endDate,
      healthFacility: {
        id: ronda.healthFacility.id,
        uuid: ronda.healthFacility.uuid,
        healthFacility: ronda.healthFacility.healthFacility,
        district: useDistrict().createDTOFromDistrict(
          ronda.healthFacility.district
        ),
      },
      rondaType: {
        id: ronda.rondaType.id,
        uuid: ronda.rondaType.uuid,
        code: ronda.rondaType.code,
        description: ronda.rondaType.description,
      },
      rondaMentees: ronda.rondaMentees.map((mentee: RondaMentee) => ({
        uuid: mentee.uuid,
        startDate: mentee.startDate,
        createdAt: mentee.createdAt,
        tutored: {
          id: mentee.tutored.id,
          uuid: mentee.tutored.uuid,
          zeroEvaluationDone: mentee.tutored.zeroEvaluationDone,
          employee_id: mentee.tutored.employee_id,
          employee: employeeService.getById(mentee.tutored.employee_id),
        },
      })),
      rondaMentors: ronda.rondaMentors.map((mentor: RondaMentor) => ({
        id: mentor.id,
        uuid: mentor.uuid,
        startDate: mentor.startDate,
        createdAt: mentor.createdAt,
        mentor: {
          id: mentor.mentor.id,
          uuid: mentor.mentor.uuid,
          perfil: mentor.mentor.perfil,
          employee_id: mentor.mentor.employee_id,
          employee: employeeService.getById(mentor.mentor.employee_id),
        },
      })),
    };
    return rondaDTO;
  }

  // function createRondaMentorFromDTO(rondaMentorDTO: any, ronda: any) {
  //   rondaMentorDTO.rondaMentor.mentor.tutorProgrammaticAreas = [];
  //   rondaMentorDTO.rondaMentor.mentor.employeeDTO =
  //     rondaMentorDTO.rondaMentor.mentor.employee;
  //   rondaMentorDTO.rondaMentor.mentor.employeeDTO.partnerDTO =
  //     rondaMentorDTO.rondaMentor.mentor.employee.partner;
  //   rondaMentorDTO.rondaMentor.mentor.employeeDTO.locationDTOSet =
  //     rondaMentorDTO.rondaMentor.mentor.employee.locations;
  //   rondaMentorDTO.rondaMentor.mentor.employeeDTO.professionalCategoryDTO =
  //     rondaMentorDTO.rondaMentor.mentor.employee.professionalCategory;
  //   const res = new RondaMentor({
  //     id: rondaMentorDTO.id,
  //     uuid: rondaMentorDTO.rondaMentor.uuid,
  //     startDate: rondaMentorDTO.rondaMentor.startDate,
  //     endDate: rondaMentorDTO.rondaMentor.endDate,
  //     createdAt: rondaMentorDTO.rondaMentor.createdAt,
  //     // relationships

  //     mentor: useMentor().createMentorFromDTO(
  //       rondaMentorDTO.rondaMentor.mentor
  //     ),
  //     ronda_id: ronda.ronda.id,
  //   });
  //   return res;
  // }

  function createRondaMentorFromDTO(rondaMentorDTO: any, ronda: any) {
    const mentorDTO = rondaMentorDTO.rondaMentor.mentor;
    const employee = mentorDTO.employee || {};

    const employeeDTO = {
      ...employee,
      partnerDTO: employee.partner,
      locationDTOSet: employee.locations,
      professionalCategoryDTO: employee.professionalCategory,
    };

    // Atualiza o mentorDTO com o employeeDTO modificado
    mentorDTO.employeeDTO = employeeDTO;
    mentorDTO.tutorProgrammaticAreas = []; // Ou mantenha isso no createMentorFromDTO se for sempre vazio

    const mentor = useMentor().createMentorFromDTO(mentorDTO);

    const res = new RondaMentor({
      id: rondaMentorDTO.id,
      uuid: rondaMentorDTO.rondaMentor.uuid,
      startDate: rondaMentorDTO.rondaMentor.startDate,
      endDate: rondaMentorDTO.rondaMentor.endDate,
      createdAt: rondaMentorDTO.rondaMentor.createdAt,
      mentor: mentor,
      ronda_id: ronda.id, // Supondo que `ronda` é o objeto Ronda
    });

    return res;
  }

  function createDTOFromRondaType(rondaType: RondaType) {
    return {
      id: rondaType.id,
      uuid: rondaType.uuid,
      code: rondaType.code,
      description: rondaType.description,
    };
  }
  function createRondaTypeFromDTO(rondaTypeDTO: any) {
    return new RondaType({
      id: rondaTypeDTO.id,
      uuid: rondaTypeDTO.uuid,
      code: rondaTypeDTO.code,
      description: rondaTypeDTO.description,
    });
  }

  return {
    createRondaFromDTO,
    createDTOFromRonda,
    createDTOFromRondaType,
    createRondaTypeFromDTO,
  };
}
