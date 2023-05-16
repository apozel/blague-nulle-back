import { Application } from "express";

import CORS from "./CORS";
import CsrfToken from "./CsrfToken";
import StatusMonitor from "./StatusMonitor";
import Helmet from "helmet";
import Passport from "../providers/Passport";
import Locals from "../providers/locals";
import Http from "./Http";

class Kernel {
  public static init(_express: Application): Application {
    // Check if CORS is enabled
    if (Locals.config().isCORSEnabled) {
      // Mount CORS middleware
      _express = CORS.mount(_express);
    }

    _express = Http.mount(_express);

    // Mount csrf token verification middleware
    _express = CsrfToken.mount(_express);

    // Security layers
    _express.use(Helmet());

    // Mount status monitor middleware
    _express = StatusMonitor.mount(_express);

    // Loads the passport configuration
    _express = Passport.mountPackage(_express);

    return _express;
  }
}

export default Kernel;
