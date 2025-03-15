import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "vzlqbyww",
  dataset: "production",
  apiVersion: "2025-03-04",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(client);
export function urlFor(source: SanityImageSource): string {
  return builder.image(source).url();
}
