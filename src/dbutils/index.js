import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import Client from "../models/Client";
import Policy from "../models/Policy";
import logger from "../utils/logger";
dotenv.config();

const log = logger.info;

const { CLIENTS_URL, POLICIES_URL } = process.env;

export const setupDB = async () => {
  try {
    const db = mongoose.connection;
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map(col => col.name);

    for (const name of collectionNames) {
      db.dropCollection(name);
      log(`dropped collection ${name}`);
    }
    log(`finished dropping collections`);

    const clients = await getClientData();
    log(`got client data ${clients.length}`);

    const policies = await getPolicyData();
    log(`got policy data ${policies.length}`);

    await processClients(clients);
    log(`processed clients`);

    await processPolicies(policies);
    log("processed policies");
  } catch (e) {
    throw new Error(`Error seeding DB: ${e.message}`);
  }
};

const getClientData = async () => {
  try {
    const results = await axios.get(CLIENTS_URL);
    return results.data.clients;
  } catch (e) {
    throw new Error(`Error getting client data: ${e.message}`);
  }
};

const getPolicyData = async () => {
  try {
    const results = await axios.get(POLICIES_URL);
    return results.data.policies;
  } catch (e) {
    throw new Error(`Error getting policy data: ${e.message}`);
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
