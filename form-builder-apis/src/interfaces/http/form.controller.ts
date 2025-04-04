import { FastifyRequest, FastifyReply } from 'fastify';
import { FormRepository } from '../../infrastructure/repositories/form.repository';
import { CreateFormUseCase } from '../../application/form/use-cases/create-form.use-case';
import { SaveFormDataUseCase } from '../../application/form/use-cases/save-form-data.use-case';
import { GetFormByIdUseCase } from '../../application/form/use-cases/get-form-by-id.user-case';
import { ListFormsUseCase } from '../../application/form/use-cases/list-forms.use-case';
import { FormNotFoundError } from '../../domain/errors/form-not-found.error';
import { InvalidFormFieldsError } from '../../domain/errors/invalid-form-fields.error';
import { MissingRequiredFieldsError } from '../../domain/errors/missing-required-fields.error';
import { InvalidFormDataError } from '../../domain/errors/invalid-form-data.error';


export class FormController {

    private _repository: FormRepository;

    static create(repository: FormRepository): FormController {
        return new FormController(repository);
    }

    constructor(repository: FormRepository) {
        this._repository = repository;
    }

    createForm = async (req: FastifyRequest, reply: FastifyReply) => {
        const { name, fields } = req.body as { name: string; fields: any[] };
        const useCase = new CreateFormUseCase(this._repository);
        try {
            const form = await useCase.execute({ name, fields });
            reply.status(201).send(form);
        } catch (error) {
            if (error instanceof InvalidFormDataError) {
              return reply.status(400).send({ message: error.message });
            }
            console.error('Unexpected error:', error);
            reply.status(500).send({ message: 'Unexpected error while creating form', error });
        }
    };
    
    getFormById = async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as { id: string };
        const useCase = new GetFormByIdUseCase(this._repository);
        try {
            const data = await useCase.execute(parseInt(id));
            reply.status(200).send(data.form);
        } catch (error) {
            if (error instanceof FormNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            reply.status(500).send({ message: 'Unexpected error', error });
        }
      };
    
    listForms = async (_req: FastifyRequest, reply: FastifyReply) => {
        console.log("REQUEST!!!");
        try {
            const useCase = new ListFormsUseCase(this._repository);
            const forms = await useCase.execute();
            reply.status(200).send(forms);
        } catch (error) {
            reply.status(500).send({ message: 'Unexpected Error', error });
        }
    };
    
    saveFormData = async (req: FastifyRequest, reply: FastifyReply) => {
        const { id } = req.params as { id: string };
        const { userData } = req.body as { userData: any[] };
        const useCase = new SaveFormDataUseCase(this._repository);
      
        try {
          const result = await useCase.execute(parseInt(id), userData);
          reply.status(201).send(result);
        } catch (error) {
          if (error instanceof FormNotFoundError) {
            return reply.status(404).send({ message: error.message });
          }
          if (error instanceof InvalidFormFieldsError) {
            return reply.status(400).send({ message: error.message });
          }
          if (error instanceof MissingRequiredFieldsError) {
            return reply.status(400).send({ message: error.message, missingFields: error.missingFields });
          }
      
          reply.status(500).send({ message: 'Unexpected Error', error });
        }
    };
}

