import dotenv from "dotenv";
import { Schema } from "mongoose";

import Client from "../models/Client";
import Policy from "../models/Policy";
import client_seed from "../../data/clients";
import policy_seed from "../../data/policies";

dotenv.config();
const ObjectIDType = Schema.Types.ObjectID;

export const setupDB = async () => {
  try {
    await Client.deleteMany({}).exec();
    await Policy.deleteMany({}).exec();
    await processClients(client_seed);
    await processPolicies(policy_seed);
  } catch (e) {
    console.log(e);
    throw new Error(`Error seeding DB: ${e.message}`);
  }
};

const processClients = async data => {
  try {
    for (const client of data) {
      const newClient = new Client(client);
      await newClient.save();
    }
  } catch (e) {
    console.log("error processing client data", e);
  }
};

const processPolicies = async data => {
  try {
    for (const policy of data) {
      const newPolicy = new Policy(policy);
      await newPolicy.save();
    }
  } catch (e) {
    console.log("error processing policy data", e);
  }
};
