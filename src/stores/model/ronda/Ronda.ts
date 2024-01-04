import { Model } from 'pinia-orm';

export default class Ronda extends Model {
  static entity = 'rondas';
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
