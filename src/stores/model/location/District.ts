import { Model } from 'pinia-orm';
import Province from './Province';

export default class District extends Model {
  static entity = 'districts';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      district: this.attr(''),
      province_id: this.attr(''),
      province: this.belongsTo(Province, 'province_id'),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
