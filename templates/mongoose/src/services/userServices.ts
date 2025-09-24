import AppError from "@/lib/AppError.js";
import User from "@/model/User.js";

function isDuplicateKeyError(
  error: unknown
): error is { code: number; keyValue: { [key: string]: unknown } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000 &&
    "keyValue" in error
  );
}

/* Services */

async function getAllUsers({
  skip = 0,
  limit = 20,
}: {
  skip?: number;
  limit?: number;
}) {
  const users = await User.find().limit(limit).skip(skip);
  return users;
}

async function getUserById(id: string) {
  const user = await User.findById(id);
  return user;
}

async function getPasswordAuthenticatedUser({
  email,
  userpassword,
}: {
  email: string;
  userpassword: string;
}) {
  const data = await User.findUserByEmailAndAuthenticate(email, userpassword);
  return data;
}

async function createUser({
  fname,
  lname,
  email,
  userpassword,
}: {
  fname: string;
  lname?: string | null;
  email: string;
  userpassword: string;
}) {
  try {
    const user = new User({
      fname,
      lname,
      email,
      password: userpassword,
    });

    const data = await user.save();
    const userData = {
      id: data.id,
      fname: data.fname,
      lname: data.lname,
      email: data.email,
    };
    return userData;
  } catch (error: unknown) {
    // Explicitly check if the error is a MongoDB duplicate key error
    if (isDuplicateKeyError(error)) {
      const field = Object.keys(error.keyValue)[0];
      throw new AppError({
        type: "ConflictError",
        message: `${field} already exists!`,
        highlight: "DuplicateKey",
        details: { field, message: "Duplicate key error" },
        status: 409,
      });
    }

    // Re-throw any other errors
    throw error;
  }
}

const UserService = {
  getAllUsers,
  getUserById,
  getPasswordAuthenticatedUser,
  createUser,
};
export default UserService;
