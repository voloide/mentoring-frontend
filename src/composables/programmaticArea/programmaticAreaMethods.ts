import ProgrammaticArea from "src/stores/model/programmaticArea/ProgrammaticArea";
import useProgram from "src/composables/program/programMethods";

export default function useProgrammaticArea() {

    function createProgrammaticAreaFromDTO(programmaticAreaDTO: any) {
      const { createProgramFromDTO } = useProgram();
        return  new ProgrammaticArea({
            id: programmaticAreaDTO.id,
            uuid: programmaticAreaDTO.uuid,
            code: programmaticAreaDTO.code,
            name: programmaticAreaDTO.name,
            description: programmaticAreaDTO.description,
            program: createProgramFromDTO(programmaticAreaDTO.program),
          })
    }

    function createDTOFromProgrammaticArea(programmaticArea: ProgrammaticArea) {
      const { createDTOFromProgram } = useProgram();
        const programmaticAreaDTO = {
            id: programmaticArea.id,
            uuid: programmaticArea.uuid,
            code: programmaticArea.code,
            name: programmaticArea.name,
            description: programmaticArea.description,
            programDTO: createDTOFromProgram(programmaticArea.program),
          }
        return  programmaticAreaDTO;
    }

    return {
        createProgrammaticAreaFromDTO,
        createDTOFromProgrammaticArea,
      };
}