import { Schema, model } from "mongoose";

const userSchema = new Schema(
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

const User = model("user", userSchema);
export default User;
