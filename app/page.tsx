import { redirect } from "next/navigation";
import { DEFAULT_DEALERSHIP_SLUG } from "@/lib/config";

// The QR code may point at the site root or directly at /review/<slug>.
// Either way, V1 sends everyone to the one active outlet: Whitefield.
export default function RootPage() {
  redirect(`/review/${DEFAULT_DEALERSHIP_SLUG}`);
}
