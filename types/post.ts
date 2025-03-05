//types/post.ts

export interface BlogPost {
  _id: string; // Add this line
  title: string;
  imageUrl?: string; // Image URL can be optional
  body: any; // Portable Text content
  publishedAt: string;
}
