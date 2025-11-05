import { IEvent } from "@/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import EventDetailItem from "@/components/EventDetailItem";
import EventAgenda from "@/components/EventAgenda";
import EventTags from "@/components/EventTags";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/api/actions/event.actions";
import { cacheLife } from "next/cache";

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  "use cache";
  cacheLife("hours");

  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const slug = await params;
  const request = await fetch(`${BASE_API_URL}/events/${slug}`);
  if (!request) return notFound;

  const { event } = await request.json();
  if (!event) return notFound();
  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
    _id,
  } = event as IEvent;
  let eventId = null;
  if (typeof _id === "string") eventId = _id;
  return (
    <section id="event">
      <div className="header">
        <h1>Event Desscription</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calender"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="calender"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap2">
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2> Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked there spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot</p>
            )}

            {eventId && <BookEvent eventId={eventId} slug={slug}></BookEvent>}
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents &&
            similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};
export default EventDetails;
