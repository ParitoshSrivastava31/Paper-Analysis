import Image from "next/image";
import { client } from "@/lib/sanity"; // Assuming Sanity client for data fetching
import { BlogPost } from "@/types/post"; // Your post type definition
import { PortableText } from "@portabletext/react";

// Revalidate the page every 10 seconds (optional, adjust as needed)
export const revalidate = 10;

// Fetch blog post data from Sanity
async function getBlogPost(id: string): Promise<BlogPost | null> {
  return await client.fetch(
    `
    *[_type == "post" && _id == $id][0] {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      body,
      publishedAt
    }
  `,
    { id }
  );
}

// Define the page component with correct params typing
export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params; // Directly access id, no Promise resolving needed

  if (!id) {
    return <div>Post not found</div>;
  }

  const post = await getBlogPost(id);
  if (!post) {
    return <div>Invalid post ID</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 p-5">
      <h1 className="text-4xl mb-8 font-semibold">{post.title}</h1>
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={800}
          height={500}
          className="my-2"
        />
      )}
      <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
      <PortableText value={post.body} />
    </div>
  );
}

// Optional: Generate static params for static site generation
export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ _id }`);
  return posts.map((post: { _id: string }) => ({ id: post._id }));
}
