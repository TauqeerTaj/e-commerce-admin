import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("ecommerce");
    const flashSales = await db
      .collection("flashsales")
      .find()
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(flashSales);
  } catch (error) {
    console.error("Error fetching flash sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sales" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, imageUrl, price, originalPrice, discount, order, active, startTime, endTime } = body;

    if (!name || !imageUrl || !price || !originalPrice || !discount) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("ecommerce");

    const newFlashSale = {
      name,
      imageUrl,
      price,
      originalPrice,
      discount,
      order: order || 0,
      active: active !== undefined ? active : true,
      startTime: startTime || new Date().toISOString(),
      endTime: endTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("flashsales").insertOne(newFlashSale);

    return NextResponse.json(
      { ...newFlashSale, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating flash sale:", error);
    return NextResponse.json(
      { error: "Failed to create flash sale" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
