import { FastifyInstance } from 'fastify';
import { createForm, getFormById, listForms, saveFormData } from '../controllers/formController';

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
    handler: createForm,
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
    handler: getFormById,
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
    handler: listForms,
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
      handler: saveFormData,
    });
};

export default formRoutes;