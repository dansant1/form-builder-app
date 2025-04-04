import { FormRepository } from '../../../infrastructure/repositories/form.repository';

export class ListFormsUseCase {
  constructor(private readonly repository: FormRepository) {}

  async execute() {
    return await this.repository.findMany();
  }
}
