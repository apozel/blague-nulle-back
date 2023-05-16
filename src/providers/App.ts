import * as path from "path";
import * as dotenv from "dotenv";

import Express from "./Express";

import Log from "../middlewares/Log";
import Database from "./Database";

class App {
  // Clear the console
  public clearConsole(): void {
    process.stdout.write("\x1B[2J\x1B[0f");
  }

  // Loads your dotenv file
  public loadConfiguration(): void {
    Log.info("Configuration :: Booting @ Master...");

    dotenv.config({ path: path.join(__dirname, "../../.env") });
  }

  // Loads the Database Pool
	public loadDatabase (): void {
		Log.info('Database :: Booting @ Master...');

		Database.init();
	}

  // Loads your Server
  public loadServer(): void {
    Log.info("Server :: Booting @ Master...");

    Express.init();
  }
}

export default new App();
