import { Request, Response, Router } from "express";
import jokes from "../data"
/**
 * GET /
 * Home page.
 */
class BlagueController {
    public path = '/blague';
    public router = Router();


    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.returnRandomJoke);
    }

    private returnRandomJoke(req: Request, res: Response): any {

        return res.json(jokes[Math.floor(Math.random() * jokes.length)])
    }
}

export default new BlagueController