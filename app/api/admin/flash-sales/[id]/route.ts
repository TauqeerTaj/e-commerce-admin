import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, imageUrl, price, originalPrice, discount, order, active, startTime, endTime } = body;

    await client.connect();
    const db = client.db("ecommerce");

    const updatedFlashSale = {
      name,
      imageUrl,
      price,
      originalPrice,
      discount,
      order: order || 0,
      active: active !== undefined ? active : true,
      startTime,
      endTime,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("flashsales")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updatedFlashSale });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...updatedFlashSale, _id: params.id });
  } catch (error) {
    console.error("Error updating flash sale:", error);
    return NextResponse.json(
      { error: "Failed to update flash sale" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await client.connect();
    const db = client.db("ecommerce");

    const result = await db
      .collection("flashsales")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Flash sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting flash sale:", error);
    return NextResponse.json(
      { error: "Failed to delete flash sale" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
