import { Model } from 'pinia-orm';
import Career from '../career/Career';
import User from '../user/User';

export default class Mentorando extends Model {
  static entity = 'mentorados';
  static primaryKey = 'id';

  fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      name: this.attr(''),
      surname: this.attr(''),
      phonenumber: this.attr(''),
      email: this.attr(''),
      version: this.number(),
      Career: {},
      User: {},
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
