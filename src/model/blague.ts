import { Schema, model } from "mongoose";
import { IBlague } from "../interfaces/blague";

export type BlagueJson = {
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

const Blague = model<IBlague>("Blague", BlagueSchema);

export default Blague;
