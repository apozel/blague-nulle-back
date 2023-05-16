import { MongoError } from "mongodb";
import mongoose from "mongoose";

import Log from "../middlewares/Log";
import Locals from "./locals";
import UserType, { accessTypes } from "../model/userTypes";

export class Database {
  public static async isPopulated(): Promise<boolean> {
    const userTypes = await UserType.find();
    if (userTypes.length === 0) {
      return false;
    }
    return true;
  }
  // Initialize your database pool
  public static async populate() {
    console.log("Attempting to populate database with user types...");
    const populated = await Database.isPopulated();
    if (!populated) {
      console.log("Populating database with user types...");
      for (let type in accessTypes) {
        const newType = new UserType({
          accessRights: type,
        });
        await newType.save();
      }
      console.log("Database populated with user types.");
    } else {
      console.log("Database already populated with user types. - Skipping.");
    }
  }

  public static connect() {
    const dsn =
      "mongodb://root:example@127.0.0.1:27017/blague-nulle?authSource=admin";
    mongoose.set("strictQuery", false);
    mongoose
      .connect(dsn, { autoCreate: true })
      .then(() => {
        Log.info("connected to mongo server at: " + dsn);
      })
      .catch((error: MongoError) => {
        Log.info("Failed to connect to the Mongo server!!");
        console.log(error);
        throw error;
      });
  }
  public static init(): void {
    this.connect();
    this.populate();
  }
}

export default Database;
