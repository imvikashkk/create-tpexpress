import prisma from "@/config/dbs/prismapgsql.js";
import AppError from "@/lib/AppError.js";
import { Prisma } from "@prisma/client";

async function getAllUsers({
  skip = 0,
  limit = 20,
}: {
  skip?: number;
  limit?: number;
}) {
  const users = await prisma.users.findMany({
    orderBy: {
      id: "desc",
    },
    skip: skip,
    take: limit,
  });
  return users;
}

async function getUserById(id: number) {
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

async function getUserForVerification({ email }: { email: string }) {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
    include: {
      credentials: {
        select: {
          hash: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Flatten the result to match the original structure
  const { credentials, ...rest } = user;
  return {
    ...rest,
    passwordhash: credentials[0]?.hash ?? null,
  };
}

async function createUser({
  fname,
  lname,
  email,
  password,
}: {
  fname: string;
  lname?: string | null;
  email: string;
  password: string;
}) {
  try {
    const user = await prisma.users.create({
      data: {
        fname,
        lname,
        email,
        credentials: {
          create: {
            hash: password,
          },
        },
      },
    });
    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 is the error code for a unique constraint violation
      throw new AppError({
        type: "ConflictError",
        message: "Email already exists!",
        highlight: "DuplicateEmail",
        details: { field: "email", message: "DuplicateEmail" },
        status: 409,
      });
    }
    throw error;
  }
}

const UserService = {
  getAllUsers,
  getUserById,
  getUserForVerification,
  createUser,
};
export default UserService;
