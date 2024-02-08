import { Model } from 'pinia-orm';

export default class Authority extends Model {
  static entity = 'authoritys';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      code: this.attr(''),
      module: this.attr(''),
      description: this.attr(''),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}