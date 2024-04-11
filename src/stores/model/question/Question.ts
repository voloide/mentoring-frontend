import { Model } from 'pinia-orm';
import QuestionCategory from './QuestionCategory';

export default class Question extends Model {
  static entity = 'questions';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      question: this.attr(''),
      question_category_id: this.attr(''),
      // Relationships
      questionCategory: this.belongsTo(QuestionCategory, 'question_category_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}