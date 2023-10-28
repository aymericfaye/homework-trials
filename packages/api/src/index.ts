import express, { Express, Response } from "express"
import { loadConfig } from "./Config"
import { TrialsService } from "./TrialsService"
import { TrialsController } from "./TrialsController"

const app: Express = express();
const port = 8080;

// Init application
// We manage all the data as static configuration files loaded in the Config object
const config = loadConfig()
// Standard service / controller pattern to structure the API
const trialsService = new TrialsService(config.trials)
const trialsController = new TrialsController(trialsService, config.countries)

app.get("/ping", (_req, res: Response) => {
  res.send("pong");
});

app.get("/trials/ongoing", trialsController.onGoing);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
