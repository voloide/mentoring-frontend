import { Model } from 'pinia-orm';
import Form from './Form';
import Question from '../question/Question';
import EvaluationType from '../question/EvaluationType';
import ResponseType from '../question/ResponseType';
import FormSection from './FormSection';

export default class FormSectionQuestion extends Model {
  static entity = 'form_section_questions';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      mandatory: this.attr(''),
      sequence: this.attr(''),
      selected: this.boolean(false),
      lifeCycleStatus: this.attr(''),
      form_section_id: this.attr(''),
      question_id: this.attr(''),
      evaluation_type_id: this.attr(''),
      response_type_id: this.attr(''),
      in_use: this.attr(false),
      // Relationships
      formSection: this.belongsTo(FormSection, 'form_section_id'),
      question: this.belongsTo(Question, 'question_id'),
      evaluationType: this.belongsTo(EvaluationType, 'evaluation_type_id'),
      responseType: this.belongsTo(ResponseType, 'response_type_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
