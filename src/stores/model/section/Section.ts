import { Model } from 'pinia-orm';

export default class Section extends Model {
  static entity = 'sections';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      uuid: this.attr(''),
      description: this.attr(''),
    };
  }

  // Custom setter for validation
  setDescription(value) {
    if (!value || value.trim() === '') {
      throw new Error('Description cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('Description cannot be longer than 100 characters.');
    }
    this.description = value;
  }

  // Example of validation before saving
  static beforeCreate(model) {
    if (!model.description || model.description.trim() === '') {
      throw new Error('Validation failed: Description is required.');
    }
    if (model.description.length > 100) {
      throw new Error('Validation failed: Description cannot exceed 100 characters.');
    }

    if (!model.uuid) {
      model.uuid = uuidv4(); // Generate UUID if not provided
    }
  }

  static piniaOptions = {
    persist: true,
  };
}
