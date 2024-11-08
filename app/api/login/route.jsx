import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://Muhammad_Zain:Zain-03120014927@first-cluster.fqodd.mongodb.net/?retryWrites=true&w=majority&appName=first-cluster";
const MONGODB_DB = "Token_Testing";
const COLLECTION_NAME = "Token_Testing";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const { db } = await connectToDatabase();
    const user = await db
      .collection(COLLECTION_NAME)
      .findOne({ email, password });

    if (user) {
      return new Response(JSON.stringify({ token_id: user.token_id }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
