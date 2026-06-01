import React from 'react'
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

const Post = ( { post }) => {
  return (
    <div
            key={post.id}
            className="bg-black text-white border border-zinc-800 rounded-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-3 py-2 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={post.profilePic}
                  alt={post.username}
                />
                <h2 className="text-sm font-semibold">
                  {post.username}
                </h2>
              </div>

              <button className="text-lg font-bold">
                •••
              </button>
            </div>

            {/* Post Image */}
            <img
              className="w-full aspect-square object-cover"
              src={post.postImage}
              alt="post"
            />

            {/* Actions */}
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
                  <MessageCircle className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
                  <Send className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
                </div>

                <Bookmark className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
              </div>

              {/* Likes */}
              <p className="font-semibold text-sm mt-3">
                {post.likes.toLocaleString()} likes
              </p>

              {/* Caption */}
              <p className="text-sm mt-2">
                <span className="font-semibold mr-2">
                  {post.username}
                </span>
                {post.caption}
              </p>

            

              {/* Time */}
              <p className="text-zinc-500 text-xs mt-2">
                {post.time}
              </p>
            </div>
          </div>
  )
}

export default Post
