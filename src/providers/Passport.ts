import { Application, NextFunction, Request, Response } from "express";

import LocalStrategy from "../services/strategies/Local";

import passport from "passport";
import Log from "../middlewares/Log";
import User from "../model/User";

class Passport {
  public mountPackage(_express: Application): Application {
    _express = _express.use(passport.initialize());
    _express = _express.use(passport.session());

    passport.serializeUser<any, any>((req, user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser<any, any>((req, id, done) => {
      User.findById(id, null, (err, user) => {
        done(err, user);
      });
    });

    this.mountLocalStrategies();

    return _express;
  }

  public mountLocalStrategies(): void {
    try {
      LocalStrategy.init(passport);
      // TODO : add services
      // GoogleStrategy.init(passport);
      // TwitterStrategy.init(passport);
    } catch (_err) {
      Log.error(_err.stack);
    }
  }

  public isAuthenticated(req: Request, res: Response, next: NextFunction): any {
    if (req.isAuthenticated()) {
      return next();
    }

    //req.flash('errors', { msg: 'Please Log-In to access any further!' });
    return res.redirect("/login");
  }

  public isAuthorized(req: Request, res: Response, next: NextFunction): any {
    const provider = req.path.split("/").slice(-1)[0];
    const token = (<any>req.user).tokens.find(
      (token: any) => token.kind === provider
    );
    if (token) {
      return next();
    } else {
      return res.redirect(`/auth/${provider}`);
    }
  }
}

export default new Passport();
