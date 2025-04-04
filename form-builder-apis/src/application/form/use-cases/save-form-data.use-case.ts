import { FormRepository } from '../../../infrastructure/repositories/form.repository';
import { FormValidationService } from '../../../domain/services/form-validation.service';
import { FormField } from '../../../domain/entities/form.entity';
import { FormNotFoundError } from '../../../domain/errors/form-not-found.error';
import { InvalidFormFieldsError } from '../../../domain/errors/invalid-form-fields.error';
import { MissingRequiredFieldsError } from '../../../domain/errors/missing-required-fields.error';

export class SaveFormDataUseCase {
  constructor(private readonly repository: FormRepository) {}

  async execute(formId: number, userData: any[]) {
    const form = await this.repository.findById(formId);
    if (!form) throw new FormNotFoundError();
    if (!form.fields) throw new InvalidFormFieldsError();

    const missing = FormValidationService.validateRequiredFields(form.fields as unknown as FormField[], userData);
    if (missing.length > 0) {
      throw new MissingRequiredFieldsError(missing.map(f => f.question));
    }

    return await this.repository.saveFormData(formId, userData);
  }
}