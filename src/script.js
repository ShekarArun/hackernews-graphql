'use strict'

const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient()
  await prisma.link.create({ data: { description: 'New link that Is added', url: 'www.newurl.com' } })
  const allLinks = await prisma.link.findMany()
  console.log(allLinks)
  await prisma.$disconnect()
}
)()
