import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCustomerFromEmail(user_email) {
  return await prisma.user.findFirst({
    where: {
      user_email: user_email,
    },
    include: {
      customer: {
        include: {
          addresses: true,
        },
      },
    },
  });
}

export default { getCustomerFromEmail };
