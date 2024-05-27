import { Model } from 'pinia-orm';

export default class Resource extends Model {
  static entity = 'resources'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.attr( null),
      uuid: this.attr(''),
      resource: this.attr(''),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
