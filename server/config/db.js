import { MongoClient } from "mongodb";

let client;
let db;

const connectDB = async () => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    db = client.db("Heritage-Sites");

    console.log(
      "MongoDB Connected to:",
      db.databaseName
    );

    return db;
  } catch (error) {
    console.error("Mongo Error:", error);
    throw error;
  }
};

export default connectDB;