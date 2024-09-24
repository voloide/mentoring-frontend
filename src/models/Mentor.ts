import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Mentor extends Model {
  static table = 'mentors';

  @field('uuid') uuid;
  @field('employee_id') employeeId;
  @field('perfil') perfil;
  @field('nivel_de_acesso') nivelDeAcesso;
}
