import { Model } from 'pinia-orm';

export default class Province extends Model {
  static entity = 'provinces';
  static primaryKey = 'id';

  fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      designation: this.attr(''),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
