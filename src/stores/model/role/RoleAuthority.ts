import { Model } from 'pinia-orm';
import Role from './Role';
import Authority from '../authority/Authority';

export default class RoleAuthority extends Model {
  static entity = 'roleAuthoritys';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      role_id: this.attr(''),
      authority_id: this.attr(''),
      //relationships
      role: this.belongsTo(Role, 'role_id'),
      authority: this.belongsTo(Authority, 'authority_id'),

    };
  }
  static piniaOptions = {
    persist: true,
  };
}