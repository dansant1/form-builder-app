import Fastify from 'fastify';
import formRoutes from './routes/formRoutes';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
const app = Fastify();

app.register(formRoutes);

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

const prisma = new PrismaClient();
app.decorate('prisma', prisma);

app.listen({ port: +(process.env.PORT as string)}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});