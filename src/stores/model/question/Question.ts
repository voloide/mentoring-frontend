import { Model } from 'pinia-orm';
import Program from '../program/Program';
import EvaluatioLocation from '../question/EvaluationLocation';

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
      lifeCycleStatus: this.attr(''),
      evaluation_location_id: this.attr(''),
      selected: this.boolean(false),
      program_id: this.attr(''),
      used_in_form_section: this.attr(false),
      // Relationships
      program: this.belongsTo(Program, 'program_id'),
      evaluationLocation: this.belongsTo(EvaluatioLocation, 'evaluation_location_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
