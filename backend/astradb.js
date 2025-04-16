
const cassandra = require("cassandra-driver");
const fs = require("fs");
require("dotenv").config();

const secureConnectBundle = process.env.ASTRA_DB_SECURE_BUNDLE_PATH;

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.ASTRA_DB_CLIENT_ID,
  process.env.ASTRA_DB_CLIENT_SECRET
);

const client = new cassandra.Client({
  cloud: { secureConnectBundle },
  keyspace: process.env.ASTRA_DB_KEYSPACE,
  authProvider
});

const connectAstra = async () => {
  try {
    await client.connect();
    console.log("Connected to Astra DB");
  } catch (error) {
    console.error("Failed to connect to Astra DB:", error);
  }
};

module.exports = { client, connectAstra };
