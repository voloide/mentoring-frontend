import { Model } from 'pinia-orm';
import District from '../location/District';

export default class HealthFacility extends Model {
  static entity = 'health_facilities';
  static primaryKey = 'id';

  fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      healthFacility: this.attr(''),
      district: this.belongTo(District, 'id'),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
