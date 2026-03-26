import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("ecommerce");
    const banners = await db
      .collection("banners")
      .find({ active: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, imageUrl, order, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and image URL are required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("ecommerce");

    const newBanner = {
      title,
      imageUrl,
      order: order || 0,
      active: active !== undefined ? active : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("banners").insertOne(newBanner);

    return NextResponse.json(
      { ...newBanner, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
