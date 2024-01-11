import { Model } from 'pinia-orm';
import Employee from '../employee/Employee';
import UserRole from '../role/UserRole';

export default class User extends Model {
  static entity = 'users';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      firstName: this.attr(''),
      lastName: this.attr(''),
      employee_id: this.attr(''),
      age: this.number(() => 0),
      password: this.attr(''),
      // relationships
      employee: this.belongsTo(Employee, 'employee_id'),
      userRoles: this.hasMany(UserRole, 'user_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}
