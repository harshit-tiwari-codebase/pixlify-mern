import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import Post from "../components/Post";

const Feed = () => {
  const posts = [
    {
      id: 1,
      username: "harshit",
      profilePic: "https://i.pravatar.cc/150?img=12",
      postImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000",
      caption: "Beautiful sunset 🌅",
      likes: 2543,
      time: "2 HOURS AGO",
    },
    {
      id: 2,
      username: "john",
      profilePic: "https://i.pravatar.cc/150?img=15",
      postImage:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000",
      caption: "Enjoying the weekend ❤️",
      likes: 1892,
      time: "5 HOURS AGO",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black flex justify-center py-4 sm:py-8">
      <div className="w-full max-w-md flex flex-col gap-5 px-2">
        {posts.map((post) => (
          <Post key={post.id} post = {post}/>
        ))}
      </div>
    </div>
  );
};

export default Feed;