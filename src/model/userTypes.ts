const accessTypes = {
  admin: "admin",
  user: "user",
  moderator: "moderator",
  banned: "banned",
};

import { Document, Model, model, Schema } from "mongoose";

export interface IUserType extends Document {
  accessRights: string;
}
const UserTypeSchema: Schema = new Schema({
  accessRights: {
    type: String,
    required: true,
    default: accessTypes.user,
  },
});

const UserType = model<IUserType>("UserType", UserTypeSchema);

export default UserType;
export { accessTypes };
