import { Schema, model, Document } from "mongoose";

interface IToken extends Document {
  tokenable_type: string;
  tokenable_id: string;
  name: string;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  deletedBy?: Schema.Types.ObjectId;
}

const tokenSchema = new Schema<IToken>(
  {
    tokenable_type: { type: String, required: true },
    tokenable_id: { type: String, required: true },
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

class TokenClass {
  private tokenModel;

  constructor() {
    this.tokenModel = model<IToken>("Token", tokenSchema);
  }

  // Add any additional methods here
  public getModel() {
    return this.tokenModel;
  }
}

const Token = new TokenClass().getModel();
export default Token;
