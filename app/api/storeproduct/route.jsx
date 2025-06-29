// app/api/storeproduct/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://admin:admin123@cluster0.cqkw3tv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_DB = "Users_Stock";
const COLLECTION_NAME = "Stock";

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
