export class InvalidFormFieldsError extends Error {
    constructor() {
      super('The form has invalid or missing fields.');
      this.name = 'InvalidFormFieldsError';
    }
}
  