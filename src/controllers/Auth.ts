import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import Log from "../middlewares/Log";
import User from "../model/User";
import validator from "validator";
import IUser from "../interfaces/user";
import UserType from "../model/userTypes";
import { accessTypes } from "../model/userTypes";
/**
 * GET /
 * Home page.
 */
class AuthController {
  public path = "/auth";
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
    this.router.post("/", this.googleCallback);
  }

  private async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (!req.body) {
      return res
        .status(400)
        .send({ error: "E-mail && Password cannot be blank" });
    }
    if (!req.body.email) {
      return res.status(400).send({ error: "E-mail cannot be blank" });
    }
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).send({ error: "E-mail is not valid" });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: "Password cannot be blank" });
    }

    if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password length must be atleast 8 characters" });
    }
    if (!req.body.confirmPassword) {
      return res
        .status(400)
        .send({ error: "Confirmation Password cannot be blank" });
    }
    if (!req.body.confirmPassword === req.body.password) {
      return res
        .status(400)
        .send({ error: "Password & Confirmation password does not match" });
    }

    // todo : if error we need to redirect to signup
    let newUsersAccessLevels = [];
    let firstUser = false;

    //if there are no users in the database, default first user to be admin
    const count = await User.countDocuments({});
    if (count === 0) {
      firstUser = true;
    }

    console.log("no access levels provided defaulting to user");
    let defaultAccessLevel = await UserType.findOne({
      accessRights: accessTypes.user,
    });
    newUsersAccessLevels.push(defaultAccessLevel._id);

    if (firstUser) {
      console.log("first user is being created");
      //if the user is the first user in the database, we will assign them the admin access level
      let adminAccessLevel = await UserType.findOne({
        accessRights: accessTypes.admin,
      });
      newUsersAccessLevels.push(adminAccessLevel._id);
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      userAccess: newUsersAccessLevels,
    });

    User.findOne({ email: req.body.email }, null, (err, existingUser) => {
      if (err) {
        return next(err);
      }

      if (existingUser) {
        // todo : if error we need to redirect to signup
        return res
          .status(400)
          .send({ error: "Account with the e-mail address already exists." });
      }

      user
        .save()
        .then(() => {
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            res.status(201).send({
              msg: "You are successfully logged in now!",
            });
            // todo : if error we need to redirect to signin
          });
        })
        .catch((error) => {
          return next(error);
        });
    });
  }
  private login(req: Request, res: Response, next: NextFunction): any {
    if (!req.body) {
      return res
        .status(400)
        .send({ error: "E-mail && Password cannot be blank" });
    }
    if (!req.body.email) {
      return res.status(400).send({ error: "E-mail cannot be blank" });
    }
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).send({ error: "E-mail is not valid" });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: "Password cannot be blank" });
    }
    if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password length must be at least 8 characters" });
    }

    //req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    Log.info("Here in the login controller #1!");
    passport.authenticate(
      "local",
      (
        err: Error,
        user: Express.User | false | null,
        info: object | string | Array<string | undefined>
      ) => {
        Log.info("Here in the login controller #2!");
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(400).send({ error: info });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res
            .status(200)
            .send({ msg: "You are successfully logged in now!" });
        });
      }
    )(req, res, next);
  }

  private logout(req: Request, res: Response): any {
    req.logout((err) => {
      if (err) {
        console.log(
          "Error : Failed to destroy the session during logout.",
          err
        );
      }

      req.user = null;
    });
  }

  private googleCallback(req: Request, res: Response): any {
    return res.redirect("/account");
  }

  public static async SUDOMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    //check if user is admin
    //he should be logged in so we can get the user from the request
    const user = req.user as IUser;
    let isAdmin = false;
    if (user) {
      let userRoles = user.userAccess as string[]; //user.userAccess is an array of strings of mongoose object ids
      //check if any of these ids(which correspond to the type) match the admin role
      for (let roleId of userRoles) {
        let role = await UserType.findById(roleId);
        if (role.accessRights === accessTypes.admin) {
          isAdmin = true;
        }
      }
    }
    if (!isAdmin) {
      return res.status(403).json({
        message: "you are not authorized to perform this action",
      });
    }

    next();
  }
}

export default new AuthController();
