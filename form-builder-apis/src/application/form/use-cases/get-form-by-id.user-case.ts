import { FormNotFoundError } from '../../../domain/errors/form-not-found.error';
import { FormRepository } from '../../../infrastructure/repositories/form.repository';

export class GetFormByIdUseCase {
  constructor(private readonly repository: FormRepository) {}

  async execute(id: number) {
    const form = await this.repository.findById(id);
    console.log("form=", form);
    if (!form) throw new FormNotFoundError();
    return { form };
  }
}
