import { Model } from 'pinia-orm';
import Role from './Role';
import User from '../user/User';

export default class UserRole extends Model {
  static entity = 'userRoles';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      role_id: this.attr(''),
      user_id: this.attr(''),
      //relationships
      role: this.belongsTo(Role, 'role_id'),
      user: this.belongsTo(User, 'user_id'),

    };
  }
  static piniaOptions = {
    persist: true,
  };
}