// import { client } from "@/lib/sanity"; // Adjust path
// import { BlogPost } from "@/types/post"; // Adjust path
// import Link from "next/link";

// export const revalidate = 10; // ISR every 10 seconds

// export async function getBlogPosts(): Promise<BlogPost[]> {
//   return await client.fetch(`
//     *[_type == "post"] | order(publishedAt desc) {
//       _id,
//       title,
//       "imageUrl": mainImage.asset->url,
//       body,
//       publishedAt
//     }
//   `);
// }

// export default async function BlogPage() {
//   const posts: BlogPost[] = await getBlogPosts();

//   return (
//     <div className="max-w-3xl mt-24 p-5 z-10">
//       <h1 className="mt-50 font-bold">Blog</h1>
//       <ul>
//         {posts.map((post) => (
//           <li key={post._id}>
//             <h2>{post.title}</h2>
//             {post.imageUrl && (
//               <img src={post.imageUrl} alt={post.title} width={300} />
//             )}
//             <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
//             <Link href={`/post/${post._id}`}>
//               <span className="text-blue-500 underline cursor-pointer z-10">
//                 Read More
//               </span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import { client } from "@/lib/sanity"; // Adjust path
import { BlogPost } from "@/types/post"; // Adjust path
import Link from "next/link";

export const revalidate = 10; // ISR every 10 seconds

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "imageUrl": mainImage.asset->url,
      body,
      publishedAt
    }
  `);
}

export default async function BlogPage() {
  let posts: BlogPost[] = await getBlogPosts();

  posts = posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto mt-24 p-5">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Blog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-105"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
              <Link href={`/post/${post._id}`}>
                <span className="mt-3 inline-block text-green-500 font-medium cursor-pointer">
                  Read More →
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
