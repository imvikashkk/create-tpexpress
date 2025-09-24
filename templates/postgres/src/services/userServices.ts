import db from "@/config/dbs/pgsql.js";
import AppError from "@/lib/AppError.js";

async function getAllUsers({
  skip = 0,
  limit = 20,
}: {
  skip?: number;
  limit?: number;
}) {
  const getUserQuery =
    "SELECT * FROM users ORDER BY id DESC LIMIT $1 OFFSET $2";
  const res = await db.query(getUserQuery, [limit, skip]);
  return res.rows;
}

async function getUserById(id: number) {
  const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0] || null;
}

async function getUserForVerification({ email }: { email: string }) {
  const res = await db.query(
    `SELECT
  u.id,
  u.fname,
  u.lname,
  u.email,
   u.created_at,
  u.updated_at,
  c.hash AS passwordhash
FROM
  users u
LEFT JOIN
  credentials  c ON u.id = c.user_id
WHERE
  u.email = $1
LIMIT 1;`,
    [email]
  );

  return res.rows[0] ?? null;
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
    const existingResult = await db.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingResult.rows.length > 0) {
      throw new AppError({
        type: "ConflictError",
        message: "Email already exists!",
        highlight: "DuplicateEmail",
        details: { field: "email", message: "DuplicateEmail" },
        status: 409,
      });
    }

    await db.query("BEGIN");
    const insertedUserResult = await db.query(
      `INSERT INTO users (fname, lname, email) VALUES ($1, $2, $3) RETURNING *`,
      [fname, lname ?? null, email]
    );

    const newUser = insertedUserResult.rows[0];
    if (!newUser) {
      throw new Error("Failed to insert user");
    }

    await db.query(
      `INSERT INTO credentials ("user_id", "hash") VALUES ($1, $2)`,
      [newUser.id, password]
    );

    await db.query("COMMIT");

    return newUser;
  } catch (error: unknown) {
    await db.query("ROLLBACK");
    throw error;
  } finally {
    await db.end();
  }
}

const UserService = {
  getAllUsers,
  getUserById,
  getUserForVerification,
  createUser,
};
export default UserService;
