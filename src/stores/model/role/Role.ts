import { Model } from 'pinia-orm';
import RoleAuthority from './RoleAuthority';

export default class Role extends Model {
  static entity = 'roles';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      code: this.attr(''),
      description: this.attr(''),
      level: this.attr(''),
      //Relationships
      roleAuthorities: this.hasMany(RoleAuthority, 'role_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}