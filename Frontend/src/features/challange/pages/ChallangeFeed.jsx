import React from "react";
import {
  Heart,
  MessageCircle,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const challengePosts = [
  {
    id: 1,
    user: "Harshit Tiwari",
    avatar:
      "https://i.pravatar.cc/150?img=1",
    challenge: "60 Days LeetCode",
    currentDay: 24,
    totalDays: 60,
    title: "Solved Two Sum",
    description:
      "Today I solved Two Sum and revised HashMaps. Learned when unordered_map is better than map.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1000",
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    user: "Rahul Sharma",
    avatar:
      "https://i.pravatar.cc/150?img=5",
    challenge: "75 Days Gym Challenge",
    currentDay: 17,
    totalDays: 75,
    title: "Back Day Completed",
    description:
      "Deadlifts, Lat Pulldowns and Rows completed. Feeling stronger than last week.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000",
    likes: 73,
    comments: 12,
  },
  {
    id: 3,
    user: "Priya Singh",
    avatar:
      "https://i.pravatar.cc/150?img=9",
    challenge: "30 Days Content Creation",
    currentDay: 9,
    totalDays: 30,
    title: "Published My First Carousel",
    description:
      "Created a LinkedIn carousel about React performance optimization.",
    image: "",
    likes: 18,
    comments: 4,
  },
];

const ChallengePostCard = ({ post }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      {/* User Info */}
      <div className="p-4 flex items-center gap-3">
        <img
          src={post.avatar}
          alt={post.user}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="text-white font-semibold">
            {post.user}
          </h3>

          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Trophy size={14} color="#fff" />

            <span>{post.challenge}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-white font-medium">
            Day {post.currentDay}
          </p>

          <p className="text-zinc-500 text-sm">
            / {post.totalDays}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4">
        <div className="h-1.5 bg-zinc-800 rounded-full">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width: `${
                (post.currentDay /
                  post.totalDays) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-white text-lg font-semibold mb-2">
          {post.title}
        </h2>

        <p className="text-zinc-300 leading-relaxed">
          {post.description}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="challenge update"
          className="w-full max-h-[500px] object-cover"
        />
      )}

      {/* Actions */}
      <div className="p-4 flex items-center gap-6 border-t border-zinc-800">
        <button className="flex items-center gap-2 text-white">
          <Heart size={20} color="#fff" />
          <span>{post.likes}</span>
        </button>

        <button className="flex items-center gap-2 text-white">
          <MessageCircle
            size={20}
            color="#fff"
          />
          <span>{post.comments}</span>
        </button>
      </div>
    </div>
  );
};

const ChallengeFeed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white mb-6 hover:text-zinc-300 transition"
          >
            <ArrowLeft size={20} color="#fff" />
            <span>Back</span>
          </button>

          <h1 className="text-white text-3xl font-bold">
            Challenge Feed
          </h1>

          <p className="text-zinc-400 mt-2">
            Follow daily progress from people completing challenges.
          </p>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {challengePosts.map((post) => (
            <ChallengePostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ChallengeFeed;