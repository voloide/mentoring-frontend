import { Model } from 'pinia-orm';
import ProgrammaticArea from '../programmaticArea/ProgrammaticArea';
import Partner from '../partner/Partner';
import FormQuestion from './FormQuestion';

export default class Form extends Model {
  static entity = 'forms';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      code: this.attr(''),
      description: this.attr(''),
      name: this.attr(''),
      targetPatient: this.attr(''),
      targetFile: this.attr(''),
      lifeCycleStatus: this.attr(''),
      createdBy: this.attr(null),
      createdAt: this.attr(null),
      programmatic_area_id: this.attr(''),
      partner_id: this.attr(''),
      // Relationships
      programmaticArea: this.belongsTo(ProgrammaticArea, 'programmatic_area_id'),
      partner: this.belongsTo(Partner, 'partner_id'),
      formQuestions: this.hasMany(FormQuestion, 'form_id'),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}