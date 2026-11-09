import { redirect } from "next/navigation";

// Preserve links from the earlier demo without keeping the old visible wording.
export default function LegacyNonMember() {
  redirect("/no-socio/carnet");
}
