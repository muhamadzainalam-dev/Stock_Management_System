import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://Muhammad_Zain:Zain-03120014927@first-cluster.fqodd.mongodb.net/?retryWrites=true&w=majority&appName=first-cluster";
const MONGODB_DB = "User_Info";
const COLLECTION_NAME = "Login&signup-Info";

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
    const { username, useremail, userpasword } = await request.json();

    const { db } = await connectToDatabase();
    const result = await db
      .collection(COLLECTION_NAME)
      .insertOne({ username, useremail, userpasword });

    return NextResponse.json(
      { message: "Account Succesfully Created", productId: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("MongoDB Insert Error:", error);
    return NextResponse.json(
      { error: "Failed To Creat Account", details: error.message },
      { status: 500 }
    );
  }
}
