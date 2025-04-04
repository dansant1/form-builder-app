import { FormRepository } from '../../../infrastructure/repositories/form.repository';
import { Form } from '../../../domain/entities/form.entity';
import { InvalidFormDataError } from '../../../domain/errors/invalid-form-data.error';

export class CreateFormUseCase {
  constructor(private readonly repository: FormRepository) {}

  async execute(data: Pick<Form, 'name' | 'fields'>) {
    if (!data.name || !Array.isArray(data.fields) || data.fields.length === 0) {
      throw new InvalidFormDataError('The form must have a name and at least one field.');
    }

    return await this.repository.create(data);
  }
}
