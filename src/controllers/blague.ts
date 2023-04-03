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
    this.router.get(`${this.path}/random`, this.getRandomJoke);
    this.router.get(`${this.path}/:id`, this.getJoke);
  }

  private getInfoJokes(req: Request, res: Response) {
    return res.json({
      size: jokes.length,
    });
  }

  private getRandomJoke(req: Request, res: Response): any {
    const id = Math.floor(Math.random() * jokes.length);
    return res.json(jokes[id]);
  }

  private getJoke(req: Request, res: Response): any {
    const { id } = req.params;
    return res.json(jokes[Number(id)]);
  }
}

export default new BlagueController();
