import { Schema, Document, Model } from "mongoose";
import bcrypt, { hash } from "bcrypt";
import AppError from "@/lib/AppError.js";
import db from "@/config/dbs/mongo.js";
import env from "@/config/env.js";

interface UserType {
  id: string;
  fname: string;
  lname?: string;
  email: string;
}

interface IUser extends Document {
  fname: string;
  lname?: string;
  email: string;
  password?: string;
}

interface IUserModel extends Model<IUser> {
  findUserByEmailAndAuthenticate(
    email: string,
    password: string
  ): Promise<
    | { authenticated: false; user: null }
    | { authenticated: true; user: UserType }
  >;
}

const UserSchema = new Schema<IUser, IUserModel>(
  {
    fname: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lname: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Please enter a valid email address!",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (_doc, ret) {
        delete ret._id;
      },
    },
  }
);

/* --- Indexing --- */
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ fname: 1, lname: 1 });

/* --- Virtuals --- */
// The `this` context is correctly typed as `IUser`
// UserSchema.virtual("fullname").get(function (this: IUser) {
//   return `${this.fname} ${this.lname}`;
// }); // if you want make it.

/* Methods & Static Methods */
// The `this` context is correctly typed as `IUserModel`
UserSchema.statics.findUserByEmailAndAuthenticate = async function (
  this: IUserModel,
  email: string,
  userpassword: string
) {
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError({
      status: 401,
      type: "Unauthorized",
      message: "Invalid credentials!",
      highlight: "User not found!",
    });
  }

  const isMatch = await bcrypt.compare(
    userpassword + env.PASSWORD_PEPPER,
    user.password as string
  );

  if (!isMatch) {
    return {
      authenticated: false,
      user: null,
    };
  }

  const { password, ...userdata } = user.toObject();
  return {
    authenticated: true,
    user: userdata,
  };
};

/* --- Middleware --- */
// The `this` context is correctly typed as `IUser`
UserSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const pepperedPassword = this.password + env.PASSWORD_PEPPER;
    this.password = await hash(pepperedPassword, env.PASSWORD_SALT_ROUNDS);
    next();
  } catch (err: unknown) {
    return next(
      new AppError({
        type: "InternalError",
        message: "Failed to hash password!",
        highlight: "PasswordHashing",
        details: err,
        status: 500,
      })
    );
  }
});

/* The model() function is called on the singleton connection object. */
const User = db.model<IUser, IUserModel>("User", UserSchema);

export default User;
