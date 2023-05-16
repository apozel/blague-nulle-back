import { Application } from "express";
import Locals from "./locals";
import Log from "../middlewares/Log";

import * as controllers from "../controllers";

class Routes {
  public mountApi(_express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;
    Log.info("Routes :: Mounting API Routes...");

    _express.use(`/${apiPrefix}/blague`, controllers.BlagueController.router);
    _express.use(`/${apiPrefix}/auth`, controllers.AuthController.router);

    return _express;
  }
}

export default new Routes();
