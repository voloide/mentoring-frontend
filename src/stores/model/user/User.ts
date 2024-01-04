import { Model } from 'pinia-orm';

export default class User extends Model {
  static entity = 'users';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      firstName: this.attr(''),
      lastName: this.attr(''),
      email: this.attr(''),
      age: this.number(() => 0),
      password: this.attr(''),
      // relationships
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
