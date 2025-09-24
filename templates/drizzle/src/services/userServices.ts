import db from "@/config/dbs/drizzlepgsql.js";
import { userCredentialsTable, usersTable } from "@/drizzle/schema.js";
import AppError from "@/lib/AppError.js";
import { desc, eq } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm";

async function getAllUsers({
  skip = 0,
  limit = 20,
}: {
  skip?: number;
  limit?: number;
}) {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt))
    .limit(limit)
    .offset(skip);
  return users;
}

async function getUserById(id: number) {
  const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return res[0] || null;
}

async function getUserForVerification({ email }: { email: string }) {
  const u = usersTable;
  const c = userCredentialsTable;

  const uCols = getTableColumns(u);

  const rows = await db
    .select({
      ...uCols,
      passwordHash: c.passwordHash,
    })
    .from(u)
    .leftJoin(c, eq(u.id, c.userId))
    .where(eq(u.email, email))
    .limit(1);

  return rows[0] ?? null;
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
  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing.length) {
    throw new AppError({
      type: "ConflictError",
      message: "Email already exists!",
      highlight: "DuplicateEmail",
      details: { field: "email", message: "DuplicateEmail" },
      status: 409,
    });
  }

  const user = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(usersTable)
      .values({ fname, lname: lname ?? null, email })
      .returning({
        id: usersTable.id,
        fname: usersTable.fname,
        lname: usersTable.lname,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      });

    const newUser = inserted[0];
    if (!newUser) {
      throw new Error("Failed to insert user");
    }

    await tx
      .insert(userCredentialsTable)
      .values({
        userId: newUser.id,
        passwordHash: password,
      })
      .returning({ userId: userCredentialsTable.userId });

    return newUser;
  });

  return user;
}

const UserService = {
  getAllUsers,
  getUserById,
  getUserForVerification,
  createUser,
};
export default UserService;
