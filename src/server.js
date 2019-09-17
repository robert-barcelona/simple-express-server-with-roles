import mongoose from "mongoose"
import express from "express"
import http from 'http'
import cors from "cors"
import routes from "./routes"
import {setupDB} from "./dbutils"
import {taskSetup} from "./helpers/scheduler"
import dotenv from "dotenv"


dotenv.config();

const {
  env: {DATABASE_URL}
} = process;

const server = () => {

  mongoose.connect(DATABASE_URL, {useNewUrlParser: true}, (err, _) => {
    if (err) throw err;

    const {PORT} = process.env;

    const app = express();

    app.use(cors());

    app.use("/api", routes());

    const server = http.createServer(app);
    setupDB()
      .then(() => {
        taskSetup(setupDB,600000);
        server.listen(PORT, () =>
          console.log(`server up and running on port ${PORT}`)
        );
      })
      .catch(e => console.log(e.message));
  });

}

export default server
