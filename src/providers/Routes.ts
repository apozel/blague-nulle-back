import { Application } from "express";
import Locals from "./locals";
import Log from "../middlewares/Log";

import * as controllers from "../controllers";

class Routes {
  public mountApi(_express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;
    Log.info("Routes :: Mounting API Routes...");

    _express.use(`/${apiPrefix}`, controllers.BlagueController.router);

    return _express;
  }
}

export default new Routes();
