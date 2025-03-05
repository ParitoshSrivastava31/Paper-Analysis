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

// Using the correct App Router page props typing
type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PostPage({
  params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams,
}: PageProps) {
  const { id } = params;
  if (!id) return <div>Post not found</div>;

  const post = await getBlogPost(id);
  if (!post) return <div>Invalid post ID</div>;

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
