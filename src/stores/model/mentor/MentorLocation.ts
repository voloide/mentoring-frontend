import { Model } from 'pinia-orm';
import Mentor from './Mentor';
import HealthFacility from '../healthfacility/HealthFacility';

export default class MentorLocation extends Model {
  static entity = 'mentor_locations';
  static primaryKey = 'id';

  fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      Mentor: {},
      HealthFacility: {},
    };
  }

  static piniaOptions = {
    persist: true,
  };
}
