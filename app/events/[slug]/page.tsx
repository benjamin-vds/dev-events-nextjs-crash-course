import { notFound } from "next/navigation";

const EventDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const { slug } = await params;
  const request = await fetch(`${BASE_API_URL}/events/${slug}`);
  const { event } = await request.json();
  if (!event) return notFound();
  return <div>{slug}</div>;
};
export default EventDetailPage;
