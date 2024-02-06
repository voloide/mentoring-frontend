import { Model } from 'pinia-orm';

export default class Province extends Model {
  static entity = 'provinces';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      designation: this.attr(''),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
