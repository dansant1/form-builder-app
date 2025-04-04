import { FormField } from '../entities/form.entity';

export class FormValidationService {
    static validateRequiredFields(fields: FormField[], userData: any[]) {
        return fields.filter((field) => {
            if (field.required) {
                const answer = userData.find((entry) => entry.question === field.question);
                return !answer;
            }
            return false;
        });
    }
}
