// Where you create or import your Prisma client.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;