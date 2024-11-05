import { Model } from 'pinia-orm';
import Form from './Form';
import Section from '../section/Section';
import FormSectionQuestion from './FormSectionQuestion';

export default class FormSection extends Model {
  static entity = 'form_sections';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      form_id: this.attr(''),
      uuid: this.attr(''),
      section_id: this.attr(''),
      sequence: this.attr(''),
      inEdition: this.boolean(false),
      isNew: this.boolean(false),
      in_use: this.boolean(false),
      // Relationships
      form: this.belongsTo(Form, 'form_id'),
      section: this.belongsTo(Section, 'section_id'),
      formSectionQuestions: this.hasMany(FormSectionQuestion, 'form_section_id'),
    };
  }

  // Custom setter for validation
  setSection(value) {
    if (!value) {
      throw new Error('Section cannot be null');
    }
    this.section_id = value;
  }

  setSequence(value) {
    if (value !== null && !Number.isInteger(value)) {
      throw new Error('Sequence must be an integer');
    }
    this.sequence = value;
  }

  // Example of validation before saving
  static beforeCreate(model) {
    if (!model.section_id) {
      throw new Error('Validation failed: Section cannot be null.');
    }
  }

  static piniaOptions = {
    persist: true,
  };
}
