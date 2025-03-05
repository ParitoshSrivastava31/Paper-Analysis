// //types/post.ts

// export interface BlogPost {
//   _id: string; // Add this line
//   title: string;
//   imageUrl?: string; // Image URL can be optional
//   body: any; // Portable Text content
//   publishedAt: string;
// }

export interface BlogPost {
  _id: string;
  title: string;
  imageUrl?: string;
  body: any;
  publishedAt: string;
}
