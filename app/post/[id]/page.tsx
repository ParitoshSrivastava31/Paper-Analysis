//app/post/%5Bid%5D/page.tsx

import Image from "next/image";
import { client } from "@/lib/sanity";
import { BlogPost } from "@/types/post";
import { PortableText } from "@portabletext/react";
import type { Metadata, ResolvingMetadata } from "next";

export const revalidate = 10;

async function getBlogPost(id: string): Promise<BlogPost | null> {
  return await client.fetch(
    `*[_type == "post" && _id == $id][0] {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      body,
      publishedAt
    }`,
    { id }
  );
}

// Updated Props: route parameters are plain objects, not Promises
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// (Optional) Generate dynamic metadata based on the blog post
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;
  const post = await getBlogPost(id);
  // Extend parent metadata if needed
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post ? post.title : "Post Not Found",
    openGraph: {
      images:
        post && post.imageUrl
          ? [post.imageUrl, ...previousImages]
          : previousImages,
    },
  };
}

export default async function PostPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;
  if (!id) return <div>Post not found</div>;

  const post = await getBlogPost(id);
  if (!post) return <div>Invalid post ID</div>;

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
