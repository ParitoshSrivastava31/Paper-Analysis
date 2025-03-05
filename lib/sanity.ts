//lib/sanity.ts

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "vzlqbyww",
  dataset: "production",
  apiVersion: "2025-03-04",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any): string {
  return builder.image(source).url();
}
