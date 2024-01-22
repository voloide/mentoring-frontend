import { Model } from 'pinia-orm';
import Employee from '../employee/Employee';

export default class Mentor extends Model {
  static entity = 'mentores';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      employee_id: this.attr(''),
      // Relationships
      employee: this.belongsTo(Employee, 'employee_id'),
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
