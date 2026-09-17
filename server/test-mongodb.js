import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

try {
  await client.connect();

  const db = client.db();

  console.log("Database:", db.databaseName);

  const collections = await db
    .listCollections()
    .toArray();

  console.log(
    "Collections:",
    collections.map((collection) => collection.name)
  );

  const sites = await db
    .collection("sites")
    .find({})
    .limit(3)
    .toArray();

  console.log("Site count sample:", sites.length);
  console.log("First site:", sites[0]);

} catch (error) {
  console.error(error);
} finally {
  await client.close();
}