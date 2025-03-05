import Image from "next/image";
import { client } from "@/lib/sanity";
import { BlogPost } from "@/types/post";
import { PortableText } from "@portabletext/react";

export const revalidate = 10;

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

type Props = {
  // Allow params to be a plain object or a Promise of an object.
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function PostPage({ params, searchParams }: Props) {
  // Ensure we have a resolved params object:
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  if (!id) return <div>Post not found</div>;

  const post = await getBlogPost(id);
  if (!post) return <div>Invalid post ID</div>;

  // Log search params to console in development only
  if (process.env.NODE_ENV === "development") {
    console.log("Search params:", searchParams);
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

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ _id }`);
  return posts.map((post: { _id: string }) => ({ id: post._id }));
}
