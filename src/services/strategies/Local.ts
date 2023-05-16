import { Strategy } from "passport-local";
import User from "../../model/User";
import Log from "../../middlewares/Log";

class Local {
  public static init(_passport: any): any {
    _passport.use(
      new Strategy({ usernameField: "email" }, (email, password, done) => {
        Log.info(`Email is ${email}`);
        Log.info(`Password is ${password}`);

        User.findOne(
          { email: email.toLowerCase() },
          null,
          null,
          (err, user) => {
            Log.info(`error is ${err}`);

            if (err) {
              return done(err);
            }
            Log.info(`user is ${user.email}`);

            if (!user) {
              return done(null, false, {
                message: `E-mail ${email} not found.`,
              });
            }

            if (user && !user.password) {
              return done(null, false, {
                message: `E-mail ${email} was not registered with us using any password. Please use the appropriate providers to Log-In again!`,
              });
            }

            Log.info("comparing password now!");

            user.comparePassword(password, (_err: Error, _isMatch: boolean) => {
              if (_err) {
                return done(_err);
              }
              if (_isMatch) {
                return done(null, user);
              }
              return done(null, false, {
                message: "Invalid E-mail or password.",
              });
            });
          }
        );
      })
    );
  }
}

export default Local;
