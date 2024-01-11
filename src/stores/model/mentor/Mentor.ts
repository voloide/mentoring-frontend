import { Model } from 'pinia-orm';
import Career from '../career/Career';
import Partner from '../partner/Partner';
import User from '../user/User';

export default class Mentor extends Model {
  static entity = 'mentores';
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
      isUser: Boolean,
      career: this.belongTo(Career, 'id'),
      partner: this.belongTo(Partner, 'id'),
      user: this.belongTo(User, 'id'),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
