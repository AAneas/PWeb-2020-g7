const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);
const app = express();

const GameInfoController = require("./controller/GameInfoController");
const AuthController = require("./controller/AuthController");

const UserMongoRepository = require("./infra/UserMongoRepository");
const PORT = 3000;
const token = "";
const DB_URL = "mongodb:27017";
const DB_NAME = "playstimation";
const authController = new AuthController(new UserMongoRepository());

mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.get("/", (req, res) => {
    res.sendStatus(200);
  });

  app.post("/signup", (req, res) => {
    console.log("Sign up request");
    const user = { email: req.body.email, password: req.body.password };
    authController.signup(user).then((result) => {
      if (result) {
        res.status(201).send({ title: "account created" });
      } else {
        res
          .status(400)
          .send({ title: "Mail already exist", error: "Mail already exist" });
      }
    });
  });

  app.post("/login", (req, res) => {
    const user = { email: req.body.email, password: req.body.password };
    authController.signin(user).then(({ token, refreshToken }) => {
      console.log("Login request");
      console.log(`refresh: ${refreshToken}`);
      if (token)
        res.status(200).send({
          title: "Sign In success",
          token: token,
          refreshToken: refreshToken,
        });
      else
        res
          .status(401)
          .send({ title: "Sign in error", error: "Invalid credential" });
    });
  });

  app.get("/game/:gameName", (req, res) => {
    console.log("in get function");
    const name = req.params.gameName;
    const gameInfoController = new GameInfoController();
    gameInfoController.buildGameInfo(name).then((result) => {
      if (result.statusCode === 200) {
        res.status(result.statusCode).send(result.gameInfo);
      } else {
        res.sendStatus(result.statusCode);
      }
    });
  });

  app.get("/authTest", (req, res) => {
    console.log(req.headers);
    token = req.headers.token;
    if (req.headers.token)
      console.log(authController.getUserIdByToken(req.headers.token));
  });

  app.post("/refreshToken", (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log(`REFRESH ${refreshToken}`);
    const newToken = authController.getRefreshToken(refreshToken);
    if (newToken) {
      res.status(200).send({ token: newToken });
    } else {
      res.sendStatus(403);
    }
  });

  app.listen(PORT, () => {
    console.log("Server listening...");
    console.log(`local : http://localhost:${PORT}`);
  });
});
