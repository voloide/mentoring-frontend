import { Model } from 'pinia-orm';

export default class Session extends Model {
  static entity = 'sessions';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      startDate: this.attr(''),
      endDate: this.attr(''),
      performedDate: this.attr(''),
      reason: this.attr(''),
      // relationships
      status: this.attr('')
    };
  }
  static piniaOptions = {
    persist: true,
  };
}