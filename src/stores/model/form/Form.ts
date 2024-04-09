import { Model } from 'pinia-orm';
import ProgrammaticArea from '../programmaticArea/ProgrammaticArea';
import Partner from '../partner/Partner';
import FormQuestion from './FormQuestion';

export default class Form extends Model {
  static entity = 'forms';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      description: this.attr(''),
      name: this.attr(''),
      targetPatient: this.attr(''),
      targetFile: this.attr(''),
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