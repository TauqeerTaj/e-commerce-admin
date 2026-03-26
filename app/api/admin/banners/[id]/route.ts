import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { title, imageUrl, order, active } = body;
    const { id } = await params; // Await the params

    console.log("Updating banner with ID:", id); // Debug log

    if (!ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id); // Debug log
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("ecommerce");

    const updateData: {
      title?: string;
      imageUrl?: string;
      order?: number;
      active?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const result = await db
      .collection("banners")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner updated successfully" });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("ecommerce");

    const result = await db
      .collection("banners")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
