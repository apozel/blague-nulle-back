import { Schema, model } from "mongoose";
import { IBlague } from "../interfaces/blague";

export type Blague = {
  id: number;
  type: string;
  joke: string;
  answer: string;
};
export const BlagueSchema = new Schema<IBlague>({
  type: { type: String, index: true, required: true },
  joke: { type: String },
  answer: { type: String },
});

const BlagueModel = model<IBlague>("Blague", BlagueSchema);

export default BlagueModel;
