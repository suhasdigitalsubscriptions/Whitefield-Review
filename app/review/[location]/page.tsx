import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealership } from "@/lib/config";
import ReviewPortal from "@/components/ReviewPortal";
import ComingSoon from "@/components/ComingSoon";

interface PageParams {
  params: Promise<{ location: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { location } = await params;
  const dealership = getDealership(location);
  if (!dealership) return {};

  const title = `${dealership.name} | Share Your Experience`;
  const description = `Share your experience with ${dealership.name}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ReviewPage({ params }: PageParams) {
  const { location } = await params;
  const dealership = getDealership(location);

  if (!dealership) {
    notFound();
  }

  if (!dealership.active) {
    return <ComingSoon dealership={dealership} />;
  }

  return <ReviewPortal dealership={dealership} />;
}
