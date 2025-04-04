import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createForm = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, fields } = request.body as { name: string; fields: any };

  try {
    const form = await prisma.form.create({
      data: {
        name,     
        fields,   
      },
    });
    reply.status(201).send(form);
  } catch (error) {
    reply.status(500).send({ message: 'Error al crear el formulario', error });
  }
};

export const getFormById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };

  try {
    const form = await prisma.form.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        fields: true,
        createdAt: true,
      }
    });
    if (!form) {
      return reply.status(404).send({ message: 'Formulario no encontrado' });
    }
    reply.status(200).send(form);
  } catch (error) {
    console.log('error=', error);
    reply.status(500).send({ message: 'Error al obtener el formulario', error });
  }
};

export const listForms = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const forms = await prisma.form.findMany({
        select: {
            id: true,
            name: true
        }
    });
    reply.status(200).send(forms);
  } catch (error) {
    console.error('error=', error);
    reply.status(500).send({ message: 'Error al obtener la lista de formularios', error });
  }
};

export const saveFormData = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { userData } = request.body as { userData: any };
  try {
    const form = await prisma.form.findUnique({
      where: { id: parseInt(id) },
      select: {
        fields: true,
      },
    }) as {
      fields: Record<string, unknown>[]
    };

    if (!form) {
      return reply.status(404).send({ message: 'Formulario no encontrado' });
    }

    const missingRequiredFields = form.fields.filter((field) => {
      if (field.required) {
        const answer = userData.find((entry: { question: string }) => entry.question === field.question);
        return !answer;
      }
      return false;
    });

    if (missingRequiredFields.length > 0) {
      return reply.status(400).send({
        message: 'Missing required fields',
        missingFields: missingRequiredFields.map((field) => field.question),
      });
    }

    const sourceRecord = await prisma.sourceRecord.create({
      data: {
        formId: parseInt(id),
      },
    });

    const sourceDataEntries = userData.map((entry: { question: string; answer: string }) => ({
      sourceRecordId: sourceRecord.id,
      question: entry.question,
      answer: entry.answer,
    }));

    const savedSourceData = await prisma.sourceData.createMany({
      data: sourceDataEntries,
    });

    reply.status(201).send({
      sourceRecord,
      savedSourceData,
    });
  } catch (error) {
    console.log('error=', error);
    reply.status(500).send({ message: 'Error al guardar los datos del formulario', error });
  }
};
