import { Request, Response, Router } from "express";
import jokes from "../data";
/**
 * GET /
 * Home page.
 */
class BlagueController {
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get("", this.getInfoJokes);
    this.router.get("/random", this.getRandomJoke);
    this.router.get("/:id", this.getJoke);
  }

  private getInfoJokes(req: Request, res: Response) {
    return res.json({
      size: jokes.length,
    });
  }

  private getRandomJoke(req: Request, res: Response): any {
    // Get one random document from the mycoll collection.
    //db.mycoll.aggregate([{ $sample: { size: 1 } }]);

    const id = Math.floor(Math.random() * jokes.length);
    return res.json(jokes[id]);
  }

  private getJoke(req: Request, res: Response): any {
    const { id } = req.params;
    return res.json(jokes[Number(id)]);
  }
}

export default new BlagueController();
