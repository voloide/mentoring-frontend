import { Model } from 'pinia-orm';
import QuestionType from './QuestionType';
import QuestionCategory from './QuestionCategory';
import ResponseType from './ResponseType';

export default class Question extends Model {
  static entity = 'questions';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      question: this.attr(''),
      question_type_id: this.attr(''),
      question_category_id: this.attr(''),
      response_type_id: this.attr(''),
      // Relationships
      questionType: this.belongsTo(QuestionType, 'question_type_id'),
      responseType: this.belongsTo(ResponseType, 'response_type_id'),
      questionCategory: this.belongsTo(QuestionCategory, 'question_category_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}