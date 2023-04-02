import { Request, Response, Router } from "express";
import jokes from "../data";
/**
 * GET /
 * Home page.
 */
class BlagueController {
  public path = "/blague";
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getInfoJokes);
    this.router.get(`${this.path}/random`, this.returnRandomJoke);
    this.router.get(`${this.path}/:id`, this.getParticularJoke);
  }

  private getInfoJokes(req: Request, res: Response) {
    return res.json({
      size: jokes.length,
    });
  }

  private returnRandomJoke(req: Request, res: Response): any {
    return res.json(jokes[Math.floor(Math.random() * jokes.length)]);
  }
  private getParticularJoke(req: Request, res: Response): any {
    const { id } = req.params;
    if (!id || typeof id !== "number") {
      return res.status(401);
    }
    res.status(200).send(jokes[id]);
  }
}

export default new BlagueController();
