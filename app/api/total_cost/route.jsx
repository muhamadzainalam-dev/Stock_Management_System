import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://admin:admin123@cluster0.cqkw3tv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "Stock";
const COLLECTION_NAME = "Total_Cost";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function POST(request) {
  try {
    const { totalCost, totalStock } = await request.json();

    const { db } = await connectToDatabase();
    const totalCostandtoatlstockDoc = await db
      .collection(COLLECTION_NAME)
      .insertOne({ totalCost, totalStock });

    if (!totalCostandtoatlstockDoc) {
      return NextResponse.json(
        { message: "Total cost and stock saved successfully!" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error saving total cost and stock:");
    return NextResponse.json(
      { message: "Failed to save total cost and stock" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const totalCostDoc = await db
      .collection(COLLECTION_NAME)
      .findOne({}, { sort: { _id: -1 } });

    if (!totalCostDoc) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    const totalCost = totalCostDoc.totalCost || 0;
    const totalStock = parseInt(totalCostDoc.totalStock, 10) || 0;

    return NextResponse.json({ totalCost, totalStock }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
