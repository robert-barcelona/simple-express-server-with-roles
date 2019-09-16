require("dotenv").config();
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import routes from './routes'

dotenv.config()

const {
  env: { DATABASE_URL }
} = process;

mongoose.connect(DATABASE_URL, { useNewUrlParser: true }, (err, _) => {
  if (err) throw err;

  const { PORT } = process.env;

  const app = express();

  app.use(cors());

  app.use("/api", routes());

  const server = http.createServer(app);
  server.listen(PORT, () =>
    console.log(`server up and running on port ${PORT}`)
  );
});

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); })

