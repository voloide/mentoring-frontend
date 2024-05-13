import { Model } from 'pinia-orm';
import ProgrammaticArea from '../programmaticArea/ProgrammaticArea';

export default class Program extends Model {
  static entity = 'programs';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.number(() => 0),
      uuid: this.attr(''),
      name: this.attr(''),
      description: this.attr(''), 
          
      programmaticAreas: this.hasMany(ProgrammaticArea, 'program_id'),
    };
  }
  static piniaOptions = {
    persist: true,
  };
}