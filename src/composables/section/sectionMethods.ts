import Section from 'src/stores/model/section/Section';

export default function useSection() {

  function createSectionFromDTO(sectionDTO) {
    const section = new Section({
      id: sectionDTO.id,
      uuid: sectionDTO.uuid,
      description: sectionDTO.description,
    });
    return section;
  }

  function createDTOFromSection(section) {
    const sectionDTO = {
      id: section.id,
      uuid: section.uuid,
      description: section.description,
    };
    return sectionDTO;
  }

  return {
    createSectionFromDTO,
    createDTOFromSection,
  };
}
