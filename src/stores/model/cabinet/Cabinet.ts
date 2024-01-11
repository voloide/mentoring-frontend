import { Model } from 'pinia-orm';

export default class Cabinet extends Model {
    static entity = 'cabinets';
    static primaryKey = 'id';
    static fields() {
      return {
        id: this.number(() => 0),
        uuid: this.attr(''),
        code: this.attr(''),
        name: this.attr(''),
        // relationships
      };
    }
    static piniaOptions = {
      persist: true,
    };
}