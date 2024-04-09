import { Model } from 'pinia-orm';
import Form from './Form';
import Question from '../question/Question';

export default class FormQuestion extends Model {
  static entity = 'forms_questions';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      mandatory: this.attr(''),
      sequence: this.attr(''),
      applicable: this.attr(''),
      form_id: this.attr(''),
      question_id: this.attr(''),
      // Relationships
      form: this.belongsTo(Form, 'form_id'),
      question: this.belongsTo(Question, 'question_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}