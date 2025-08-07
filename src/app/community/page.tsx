"use client";
import { useEffect, useState } from "react";

interface Author {
  id: string;
  name?: string | null;
}

interface Comment {
  id: string;
  content: string;
  author?: Author;
}

interface Post {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  author?: Author;
  comments: Comment[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/community");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: unknown = await res.json();
      if (Array.isArray(data)) {
        setPosts(data as Post[]);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      const newPost: Post = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const res = await fetch("/api/community/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) throw new Error("Failed to upvote");
      const updatedPost: Post = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleComment = async (postId: string) => {
    try {
      const res = await fetch("/api/community/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: commentContent[postId] || "" }),
      });
      if (!res.ok) throw new Error("Failed to comment");
      const updatedPost: Post = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
      setCommentContent((prev) => ({ ...prev, [postId]: "" }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Loading posts...</p>}
      <form onSubmit={handleCreatePost} className="bg-white shadow p-4 rounded-xl mb-6">
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your prompt or idea..."
          className="w-full border p-2 rounded mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Share Post
        </button>
      </form>

      {posts.length === 0 && !loading && <p>No community posts yet.</p>}
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow p-4 rounded-xl mb-4">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
          <div className="flex items-center space-x-4 mt-3">
            <button onClick={() => handleUpvote(post.id)} className="text-blue-600 hover:underline">
              👍 {post.upvotes}
            </button>
            <span className="text-sm text-gray-500">By {post.author?.name || "Anonymous"}</span>
          </div>

          {post.comments.length > 0 ? (
            post.comments.map((c) => (
              <div key={c.id} className="border-t pt-2 text-sm">
                <span className="font-semibold">{c.author?.name || "User"}:</span> {c.content}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 mt-2">No comments yet.</p>
          )}

          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border p-2 rounded"
              value={commentContent[post.id] || ""}
              onChange={(e) => setCommentContent((prev) => ({ ...prev, [post.id]: e.target.value }))}
            />
            <button onClick={() => handleComment(post.id)} className="bg-green-600 text-white px-3 rounded">
              Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
