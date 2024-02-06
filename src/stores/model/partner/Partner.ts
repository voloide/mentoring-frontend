import { Model } from 'pinia-orm';

export default class Partner extends Model {
  static entity = 'partners';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      name: this.attr(''),
      description: this.attr(''),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
