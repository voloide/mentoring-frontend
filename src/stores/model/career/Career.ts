import { Model } from 'pinia-orm';
import CareerType from './CareerType';

export default class Career extends Model {
  static entity = 'careers';
  static primaryKey = 'id';

  fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      position: this.attr(''),
      careerType: this.belongTo(CareerType, 'id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
