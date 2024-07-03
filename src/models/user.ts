// import { Schema, model } from "mongoose";

// const userSchema = new Schema(
//   {
//     email: {
//       value: { type: String, required: true, unique: true },
//       is_verified: { type: Boolean, required: true, default: false },
//     },
//     password: { type: String, required: true },
//     status: { type: Boolean, required: true, default: true },
//     isDeleted: { type: Boolean, required: true, default: false },
//     createdBy: { type: Schema.Types.ObjectId, ref: "User" },
//     updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
//     deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const User = model("user", userSchema);
// export default User;

import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: {
    value: string;
    is_verified: boolean;
  };
  password: string;
  status: boolean;
  isDeleted: boolean;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  deletedBy?: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      value: { type: String, required: true, unique: true },
      is_verified: { type: Boolean, required: true, default: false },
    },
    password: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

class UserClass {
  private userModel;

  constructor() {
    this.userModel = model<IUser>("User", userSchema);
  }

  // Add any additional methods here
  public getModel() {
    return this.userModel;
  }
}

const User = new UserClass().getModel();
export default User;
