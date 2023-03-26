import { readFileSync } from "fs";
import { join } from "path";
import Log from "../middlewares/Log";

export type Blague = {

    "id": number,
    "type": string,
    "joke": string,
    "answer": string

}
