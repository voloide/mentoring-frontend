import { Model } from 'pinia-orm';
import ProgrammaticArea from '../programmaticArea/ProgrammaticArea';
import Mentor from '../mentor/Mentor';

export default class TutorProgrammaticArea extends Model {
  static entity = 'tutorProgrammaticAreas';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.attr( null),
      uuid: this.attr(''),
      salt: this.attr(''),
      mentor_id: this.attr(''),
      programmatic_area_id: this.attr(''),
      lifeCycleStatus: this.attr(''),
      // relationships

      mentor: this.belongsTo(Mentor, 'mentor_id'),
      programmaticArea: this.belongsTo(ProgrammaticArea, 'programmatic_area_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
