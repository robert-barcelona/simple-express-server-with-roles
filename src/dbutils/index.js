import dotenv from "dotenv";
import axios from "axios";

import Client from "../models/Client";
import Policy from "../models/Policy";

dotenv.config();

const { CLIENTS_URL, POLICIES_URL } = process.env;

export const setupDB = async () => {
  try {
    await Client.deleteMany({}).exec();
    await Policy.deleteMany({}).exec();
    const clients = await getClientData();
    const policies = await getPolicyData();
    await processClients(clients);
    await processPolicies(policies);
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
