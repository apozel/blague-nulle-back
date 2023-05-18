import { Request, Response, Router } from "express";
import Blague from "../model/blague";
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

  private async getInfoJokes(req: Request, res: Response) {
    const number = await Blague.count()
    const listOfType: string[] = await Blague.distinct("type")
    return res.json({
      size: number,
      tags: listOfType
    });
  }

  private async getRandomJoke(req: Request, res: Response): Promise<any> {
    // Get one random document from the mycoll collection.
    //db.mycoll.aggregate([{ $sample: { size: 1 } }]);
    //BlagueModel.aggregate([{ $sample: { size: 1 } }])
    const joke = await Blague.aggregate([{ $sample: { size: 1 } }])
    return res.json(joke[0]);
  }

  private async getJoke(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const joke = await Blague.findById(id)
    return res.json(joke);
  }
}

export default new BlagueController();
