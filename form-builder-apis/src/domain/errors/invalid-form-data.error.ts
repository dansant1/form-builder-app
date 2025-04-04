export class InvalidFormDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidFormDataError';
    }
  }
  