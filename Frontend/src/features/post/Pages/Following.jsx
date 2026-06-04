import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

const Following = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  console.log(user)

  return (
    <div  className="w-full min-h-screen flex justify-center bg-black text-amber-50">
     <div className="createPost-container w-full max-w-md lg:max-w-5xl xl:max-w-5xl">
          <div className="nav w-full h-12 flex items-center justify-between px-4 border-b border-zinc-800">
          <button
            onClick={() => navigate(-1)}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              hover:bg-zinc-900
              active:bg-zinc-800
              transition-colors
              duration-150
            "
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-xl font-bold lg:text-2xl">Following</h2>
        </div>
        <div className="px-3 py-2">
  {user?.followers?.length > 0 ? (
    <div className="flex flex-col gap-1">
      {user.following.map((following) => (
        <div
          key={following._id}
          className="
            flex items-center justify-between
            px-3 py-3
            rounded-xl
            hover:bg-zinc-900/70
            transition-all duration-200
            cursor-pointer
          "
        >
          <div className="flex items-center gap-3">
            <img
              src={following.profile_img}
              alt={following.username}
              className="
                w-12 h-12
                rounded-full
                object-cover
                border border-zinc-700
              "
            />

            <div>
              <h3 className="font-semibold text-white">
                {following.username}
              </h3>

              <p className="text-sm text-zinc-400">
                @{following.username}
              </p>
            </div>
          </div>

          <button
            className="
              px-4 py-1.5
              rounded-lg
              bg-zinc-800
              hover:bg-zinc-700
              text-sm font-medium
              transition-colors
            "
          >
            Following
          </button>
        </div>
      ))}
    </div>
  ) : (
    <div className="h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-zinc-300">
          No following yet
        </h2>

        <p className="text-zinc-500 text-sm mt-1">
          When people follow you, they'll appear here.
        </p>
      </div>
    </div>
  )}
</div>
     </div>
    </div>
  )
}

export default Following
