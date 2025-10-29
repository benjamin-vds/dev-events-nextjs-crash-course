import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(request: NextRequest): Promise<any> {
    try {
        await connectDB();
        const formData = await request.formData();
        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({message: 'Invalid JSON data format', status: 400})
        }
        const createdEvent = await Event.create(event);
        return NextResponse.json({message: 'Event created successfully', event: createdEvent}, {status: 201});
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            message: 'Event creation Failed ',
            error: e instanceof Error ? e.message : 'Unknown',

        }, {status: 500});
    }
}