import Locals from "../providers/locals";
import Log from "./Log";
import { Application } from "express";
import bodyParser from "body-parser";
import connect from "connect-mongo";
import session from "express-session";

class Http {
  public static mount(_express: Application): Application {
    Log.info("Booting the 'HTTP' middleware...");

    // Enables the request body parser
    _express.use(
      bodyParser.json({
        limit: Locals.config().maxUploadLimit,
      })
    );

    _express.use(
      bodyParser.urlencoded({
        limit: Locals.config().maxUploadLimit,
        parameterLimit: Locals.config().maxParameterLimit,
        extended: false,
      })
    );

    // Disable the x-powered-by header in response
    _express.disable("x-powered-by");

    /**
     * Enables the session store
     *
     * Note: You can also add redis-store
     * into the options object.
     */
    const options = {
      resave: true,
      saveUninitialized: true,
      secret: Locals.config().appSecret,
      cookie: {
        maxAge: 1209600000, // two weeks (in ms)
      },
      store: new connect({
        mongoUrl: Locals.config().mongooseUrl,
        // autoReconnect: true,
      }),
    };

    _express.use(session(options));

    // Enables the CORS
    // _express.use(cors());

    // Enables the "gzip" / "deflate" compression for response
    // _express.use(compress());

    return _express;
  }
}

export default Http;
