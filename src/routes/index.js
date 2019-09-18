import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { logic, LogicError } from "../logic";
import jwt from "jsonwebtoken";
import jwtexpress from "express-jwt";
import logger from "../utils/logger";

const guard = require("express-jwt-permissions")();

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
    const payload = { email, permissions: [user.role] };
    const { JWT_SECRET, JWT_EXP } = process.env;
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP
    });
    res.json({ message: "user authenticated", token });
  } catch (e) {
    res
      .status(e instanceof LogicError ? 401 : 403)
      .json({ message: e.message });
  }
});

router.get(
  "/users/id/:userId",
  jwtexpress({ secret: process.env.JWT_SECRET }),
  guard.check([["user"], ["admin"]]),
  async (req, res) => {
    logger.debug(
      `GET://users/id/:userId,  CONTEXT: "router.js",  userId:${req.params.userId} `
    );
    try {
      const userId = req.params.userId;
      const user = await logic.getUserForUserId(userId);
      res.json({ user });
    } catch (e) {
      res
        .status(e instanceof LogicError ? 401 : 500)
        .json({ message: e.message });
    }
  }
);

router.get(
  "/users/name/:name",
  jwtexpress({ secret: process.env.JWT_SECRET }),
  guard.check([["user"], ["admin"]]),
  async (req, res) => {
    logger.debug(
      `GET://users/name/:name,  CONTEXT: "router.js",  NAME:${req.params.name} `
    );
    try {
      const name = req.params.name;
      const user = await logic.getUserForUserName(name);
      res.json({ user });
    } catch (e) {
      res
        .status(e instanceof LogicError ? 401 : 500)
        .json({ message: e.message });
    }
  }
);

router.get(
  "/users/policy/:policyNumber",
  jwtexpress({ secret: process.env.JWT_SECRET }),
  guard.check("admin"),
  async (req, res) => {
    logger.debug(
      `GET://users/policy/:policyNumber,  CONTEXT: "router.js",  POLICYNUMBER:${req.params.policyNumber} `
    );
    try {
      const policyNumber = req.params.policyNumber;
      const user = await logic.getUserForPolicyNumber(policyNumber);
      res.json({ user });
    } catch (e) {
      res
        .status(e instanceof LogicError ? 401 : 500)
        .json({ message: e.message });
    }
  }
);

router.get(
  "/policies/name/:name",
  jwtexpress({ secret: process.env.JWT_SECRET }),
  guard.check("admin"),
  async (req, res) => {
    logger.debug(
      `GET://policies/name/:name,  CONTEXT: "router.js",  NAME:${req.params.name} `
    );
    try {
      const name = req.params.name;
      const policies = await logic.getPoliciesForUserName(name);
      res.json({ policies });
    } catch (e) {
      res
        .status(e instanceof LogicError ? 401 : 500)
        .json({ message: e.message });
    }
  }
);


export default () => router;
