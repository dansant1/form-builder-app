export class MissingRequiredFieldsError extends Error {
    public readonly missingFields: string[];
    constructor(missingFields: string[]) {
        super('Some required fields are missing.');
        this.name = 'MissingRequiredFieldsError';
        this.missingFields = missingFields;
    }
}
  