import { Model } from 'pinia-orm';
import Form from './Form';
import Question from '../question/Question';
import EvaluationType from '../question/EvaluationType';
import ResponseType from '../question/ResponseType';

export default class FormQuestion extends Model {
  static entity = 'forms_questions';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      mandatory: this.attr(''),
      sequence: this.attr(''),
      assessmentType: this.attr(''),
      anwserType: this.attr(''),
      applicable: this.attr(''),
      selected: this.boolean(false),
      form_id: this.attr(''),
      question_id: this.attr(''),
      evaluation_type_id: this.attr(''),
      response_type_id: this.attr(''),
      // Relationships
      form: this.belongsTo(Form, 'form_id'),
      question: this.belongsTo(Question, 'question_id'),
      evaluationType: this.belongsTo(EvaluationType, 'evaluation_type_id'),
      responseType: this.belongsTo(ResponseType, 'response_type_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}