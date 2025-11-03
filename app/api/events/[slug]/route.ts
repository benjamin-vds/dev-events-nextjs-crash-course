import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import type { IEvent } from "@/database";
import { STATUS } from "@/lib/api/status";


// Route params type
type Params = { slug: string };

// Lightweight API response types
type ErrorBody = { message: string; details?: string };

type SuccessBody = { message: string; event: IEvent };

// Basic slug validator (kebab-case, lowercase letters, numbers, hyphens)
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> }
): Promise<NextResponse> {
  try {

    // Ensure DB connection
    await connectDB();
    
    // Await and extract slug params
    const { slug: rawSlug } = await context.params;

    // Validate presence
    if (!rawSlug || typeof rawSlug !== "string") {
      return NextResponse.json<ErrorBody>(
        { message: "Invalid or missing slug parameter" },
        STATUS.BAD_REQUEST
      );
    }

    const slug = rawSlug.trim().toLowerCase();

    // Validate format
    if (!SLUG_REGEX.test(slug)) {
      return NextResponse.json<ErrorBody>(
        { message: "Invalid slug format", details: "Use lowercase letters, numbers, and hyphens only" },
        STATUS.BAD_REQUEST
      );
    }

    // Query event by slug; use lean() for plain JSON object
    const event = await Event.findOne({ slug }).lean<IEvent | null>();

    if (!event) {
      return NextResponse.json<ErrorBody>(
        { message: "Event not found" },
        STATUS.NOT_FOUND
      );
    }

    return NextResponse.json<SuccessBody>(
      { message: "Event fetched successfully", event: event as IEvent },
      STATUS.OK
    );
  } catch (err) {
    const details = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<ErrorBody>(
      { message: "Failed to fetch event", details },
      STATUS.SERVER_ERROR
    );
  }
}
