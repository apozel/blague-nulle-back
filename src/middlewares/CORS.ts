/**
 * Enables the CORS
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import cors, { CorsOptions } from "cors";
import { Application } from "express";

import Log from "./Log";
import Locals from "../providers/locals";

class CORS {
  public mount(_express: Application): Application {
    Log.info("Booting the 'CORS' middleware...");
    const url = (<string>Locals.config().url).startsWith("http://localhost")
      ? "*"
      : Locals.config().url;
    const options: CorsOptions = {
      origin: url,
      optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    };

    _express.use(cors(options));

    return _express;
  }
}

export default new CORS();
