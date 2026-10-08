import { redirect } from "next/navigation";

/** Global Gallery now lives inside About Me. */
export default function GalleryPage() {
  redirect("/about");
}
