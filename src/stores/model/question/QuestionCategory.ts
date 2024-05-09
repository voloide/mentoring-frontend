import { Model } from 'pinia-orm';

export default class QuestionCategory extends Model {
  static entity = 'questions_categories';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      category: this.attr(''),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}