import Program from "src/stores/model/program/Program";

export default function useProgram() {

    function createProgramFromDTO(programDTO: any) {
        return  new Program({
            id: programDTO.id,
            uuid: programDTO.uuid,
            name: programDTO.name,
            description: programDTO.description,
          })
    }

    function createDTOFromProgram(program: Program) {
        const programDTO = {
            id: program.id,
            uuid: program.uuid,
            name: program.name,
            description: program.description,
          }
        return  programDTO;
    }

    return {
        createProgramFromDTO,
        createDTOFromProgram,
      };
}