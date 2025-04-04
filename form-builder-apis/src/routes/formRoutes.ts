import { FastifyInstance } from 'fastify';
import { FormController } from '../interfaces/http/form.controller';
import { FormRepository } from '../infrastructure/repositories/form.repository';

const repository = new FormRepository();
const controller = FormController.create(repository);

const formRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/api/forms', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          fields: { type: 'array', items: { type: 'object' } },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            fields: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: controller.createForm,
  });

  fastify.get('/api/forms/:id', {
    schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              fields: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    question: { type: 'string' },
                    required: { type: 'boolean' },
                  },
                },
              },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
    },
    handler: controller.getFormById,
  });

  fastify.get('/api/forms', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              fields: { type: 'object' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    handler: controller.listForms,
  });

    fastify.post('/api/forms/:id', {
      schema: {
        body: {
          type: 'object',
          properties: {
            userData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  answer: { type: 'string' },
                },
                required: ['question', 'answer'],
              },
            },
          },
          required: ['userData'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              formId: { type: 'number' },
              data: { type: 'object' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      handler: controller.saveFormData,
    });
};

export default formRoutes;