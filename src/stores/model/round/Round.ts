import { Model } from 'pinia-orm';

export default class Round extends Model {
  static entity = 'rounds';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      description: this.attr(''),
      startDate: this.attr(''),
      endtDate: this.attr(''),
      // relationships
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
