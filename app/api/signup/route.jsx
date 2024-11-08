import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

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

export async function POST(request) {
  try {
    const data = await request.json();
    const token_id = uuidv4();

    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.insertOne({
      ...data,
      token_id,
    });

    return NextResponse.json({ token_id });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
