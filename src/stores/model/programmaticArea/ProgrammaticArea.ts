import { Model } from 'pinia-orm';
import Program from '../program/Program';

export default class ProgrammaticArea extends Model {
  static entity = 'programmatic_areas';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      name: this.attr(''),
      description: this.attr(''),
      program_id: this.attr(''),
      
      // Relationships
      program: this.belongsTo(Program, 'program_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}