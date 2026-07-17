
import Program from 'src/stores/model/program/Program';

export default function useProgram() {

    function createProgramFromDTO(programDTO: any) {
      return  new Program({
          id: programDTO.id,
          uuid: programDTO.uuid,
          name: programDTO.name,
          description: programDTO.description,
          code: programDTO.code,
        })
    }

    function createDTOFromProgram(program: Program | null) {
        const programDTO = {
          id: program.id,
          uuid: program.uuid,
          name: program.name,
          description: program.description,
          code: program.code,
        }
        return  programDTO;
    }

    return {
      createProgramFromDTO,
      createDTOFromProgram,
    };
}
