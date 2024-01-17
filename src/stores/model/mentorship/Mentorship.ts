import { Model } from 'pinia-orm';
import Cabinet from '../cabinet/Cabinet';

export default class Mentorship extends Model {
  static entity = 'mentorships';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      startDate: this.attr(''),
      endDate: this.attr(''),
      description: this.attr(''),

      // relationships
      cabinet: this.belongsTo(Cabinet, 'id'),
      door: this.attr(''),
      iterationType: this.attr(''),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}