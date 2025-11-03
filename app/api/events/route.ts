import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";
import { STATUS } from "@/lib/api/status";



export async function POST(request: NextRequest): Promise<any> {
  try {
    await connectDB();
    const formData = await request.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        {
          message: "Invalid JSON data format",
        },
        STATUS.BAD_REQUEST
      );
    }

    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        STATUS.BAD_REQUEST
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "nextjs-events" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        )
        .end(buffer);
    });
    event.image = (uploadResult as { secure_url: string }).secure_url;
    const createdEvent = await Event.create(event);
    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      STATUS.OK
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation Failed ",
        error: e instanceof Error ? e.message : "Unknown",
      },
      STATUS.SERVER_ERROR
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched succesfully", events },
      STATUS.OK
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed: ", error: e },
      STATUS.SERVER_ERROR
    );
  }
}
