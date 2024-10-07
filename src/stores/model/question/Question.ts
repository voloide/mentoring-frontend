import { Model } from 'pinia-orm';
import Program from '../program/Program';

export default class Question extends Model {
  static entity = 'questions';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      code: this.attr(''),
      tableCode: this.attr(''),
      question: this.attr(''),
      selected: this.boolean(false),
      program_id: this.attr(''),
      // Relationships
      program: this.belongsTo(Program, 'program_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}