// app/api/storeproduct/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://Muhammad_Zain:Zain-03120014927@first-cluster.fqodd.mongodb.net/?retryWrites=true&w=majority&appName=first-cluster";
const MONGODB_DB = "Token_Poduct_Testing";
const COLLECTION_NAME = "Token_Poduct_Testing";

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
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.insertOne(data);

    return NextResponse.json({
      message: "Product stored successfully",
      result,
    });
  } catch (error) {
    console.error("Error storing product:", error);
    return NextResponse.json(
      { error: "Failed to store product" },
      { status: 500 }
    );
  }
}
