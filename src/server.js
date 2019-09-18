import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { setupDB } from "./dbutils";
import { taskSetup } from "./helpers/scheduler";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();
mongoose.set("useCreateIndex", true);

const {
  env: { DATABASE_URL, PORT, SERVICE_LOAD_INTERVAL = 600000 }
} = process;

const server = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const app = express();
    app.use(cors());
    app.use("/api", routes());
    await setupDB();
    logger.info("setup db");
    taskSetup(setupDB, SERVICE_LOAD_INTERVAL);
    return new Promise(resolve => {
      app.listen(PORT, () => {
        console.log(`server up and running on port ${PORT}`);
        resolve();
      });
    });
  } catch (e) {
    console.log(e);
    logger.error(`Server Initialisation Error: ${e.message}`);
  }
};

export default server;
