import { MongoError } from "mongodb";
import mongoose from "mongoose";
import blagueJson from "../data/index"
import Log from "../middlewares/Log";
import Locals from "./locals";
import UserType, { accessTypes } from "../model/userTypes";
import Blague, { BlagueJson } from "../model/blague";

export class Database {
  // Initialize your database pool
  public static async populate() {
    this.populateAccessTypes()
    this.populateJokes()
  }

  public static async isAccessTypesPopulated(): Promise<boolean> {
    const userTypes = await UserType.find();
    if (userTypes.length === 0) {
      return false;
    }
    return true;
  }

  public static async populateAccessTypes() {
    console.log("Attempting to populate database with user types...");
    const populated = await this.isAccessTypesPopulated();
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

  public static async isBlaguePopulated(): Promise<boolean> {
    const databaseBlague = await Blague.count();
    if (databaseBlague === 0) {
      return false;
    }
    return true;
  }

  public static async populateJokes() {
    console.log("Attempting to populate database with jokes...");
    const populated = await this.isBlaguePopulated();
    if (!populated) {
      console.log("Populating database with jokes...");
      for (let blague of (blagueJson as BlagueJson[])) {
        const newBlague = new Blague({
          "type": blague.type,
          "joke": blague.joke,
          "answer": blague.answer
        });
        await newBlague.save();
      }
      console.log("Database populated with jokes.");
    } else {
      console.log("Database already populated with jokes. - Skipping.");
    }
  }

  public static connect() {
    const dsn =
      "mongodb://root:example@127.0.0.1:27017/blague-nulle?authSource=admin"; // todo : put this in config class 
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
