import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import FlashSaleTime from "@/models/FlashSaleTime";


export async function GET() {
  try {
    await connectDB();

    const flashSaleTimes = await FlashSaleTime.find().sort({ startTime: 1 });

    return NextResponse.json(flashSaleTimes, { status: 200 });
  } catch (error) {
    console.error("Error fetching flash sale times:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { startTime, endTime } = body;

    if (!startTime || !endTime) {
      return NextResponse.json(
        { message: "Start time and end time are required" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { message: "End time must be after start time" },
        { status: 400 }
      );
    }

    const flashSaleTime = await FlashSaleTime.create({
      startTime: start,
      endTime: end,
    });

    return NextResponse.json(flashSaleTime, { status: 201 });
  } catch (error) {
    console.error("Error creating flash sale time:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json({ message }, { status: 500 });
  }
}