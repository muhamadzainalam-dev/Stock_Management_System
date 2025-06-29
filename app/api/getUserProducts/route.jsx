// app/api/getUserProducts/route.js
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token_id = searchParams.get("token_id");

    if (!token_id) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);

    const products = await collection.find({ token_id }).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
