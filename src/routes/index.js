import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { logic, LogicError } from "../logic";
import jwt from "jsonwebtoken";
import jwtexpress from "express-jwt";
import logger from "../utils/logger";

var guard = require("express-jwt-permissions")();

import asyncHandler from "express-async-handler";

dotenv.config();
const router = express.Router();

const jsonBodyParser = bodyParser.json();

router.post("/authenticate", jsonBodyParser, async (req, res) => {
  try {
    const {
      body: { email, password }
    } = req;
    logger.debug(
      `POST:/authenticate,  CONTEXT: "router.js",  PASSWORD:${password}, EMAIL:${email} `
    );

    const user = await logic.authenticate(email, password);
    const payload = { email, permissions: [user.status] };
    const { JWT_SECRET, JWT_EXP } = process.env;
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP
    });
    res.json({ message: "user authenticated", token });
  } catch (e) {
    res
      .status(e instanceof LogicError ? 401 : 500)
      .json({ message: e.message });
  }
});

router.get(
  "/",
  jwtexpress({ secret: process.env.JWT_SECRET }),
  guard.check("admin"),
  async (req, res) => {
    console.log(req.user)
    res.status(200).send("ok");
  }
);

export default () => router;
