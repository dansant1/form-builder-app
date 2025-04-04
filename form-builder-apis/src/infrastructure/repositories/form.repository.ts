import { PrismaClient } from '@prisma/client';
import { Form } from '../../domain/entities/form.entity';

const prisma = new PrismaClient();

export class FormRepository {
  async create(form: Form) {
    return await prisma.form.create({ data: {
        name: form.name,
        fields: form.fields as any
    } });
  }

  async findById(id: number) {
    return await prisma.form.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        fields: true,
        createdAt: true,
      },
    });
  }

  async findMany() {
    return await prisma.form.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async saveFormData(formId: number, userData: any[]) {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { fields: true },
    });

    if (!form) return null;

    const sourceRecord = await prisma.sourceRecord.create({
      data: { formId },
    });

    const sourceDataEntries = userData.map((entry) => ({
      sourceRecordId: sourceRecord.id,
      question: entry.question,
      answer: entry.answer,
    }));

    await prisma.sourceData.createMany({ data: sourceDataEntries });

    return { sourceRecord, sourceData: sourceDataEntries };
  }
}
