import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers() {
  return await prisma.user.findMany({
    include: {
      roles: true,
    },
  });
}

async function getUsersSearch(email) {
  try {
    const users = await prisma.user.findMany({
      where: {
        user_email: email,
      },
      include: {
        roles: true,
      },
    });

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setUserCustomer(
  email,
  hash_pass,
  name,
  street,
  city,
  zip,
  country
) {
  return await prisma.user.create({
    data: {
      user_email: email,
      user_password: hash_pass,
      roles: {
        connect: {
          user_role_id: 1, // id=1 indicates customer user role
        },
      },
      customer: {
        create: {
          customer_name: name,
          registration_date: new Date().toISOString(),
          addresses: {
            create: {
              street: street,
              city: city,
              zip_code: zip,
              country: country,
            },
          },
        },
      },
    },
    include: {
      roles: true,
      customer: {
        include: {
          addresses: true,
        },
      },
    },
  });
}

async function setUserToken(token_id, user_id) {
  await prisma.user_token.create({
    data: {
      token_id: token_id,
      user: {
        connect: { user_id: user_id },
      },
    },
  });
}

async function getUserToken(token_id) {
  return await prisma.user_token.findUnique({
    where: {
      token_id: token_id,
    },
    include: {
      user: true,
    },
  });
}

async function deleteUserToken(token_id) {
  await prisma.user_token.delete({
    where: {
      token_id: token_id,
    },
  });
}

export default {
  getUsers,
  setUserCustomer,
  getUsersSearch,
  setUserToken,
  getUserToken,
  deleteUserToken,
};
