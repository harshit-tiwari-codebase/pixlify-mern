import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

import Feed from "./features/post/Pages/Feed";
import CreatePost from "./features/post/Pages/CreatePost";
import MyProfile from "./features/post/Pages/MyProfile";
import Followers from "./features/post/Pages/Followers";
import Following from "./features/post/Pages/Following";

import ChallengeFeed from "./features/challange/pages/ChallangeFeed";
import HeatmapPage from "./features/challange/pages/HeatmapPage";

import ChallengeProvider from "./features/challange/context/ChallangeContext";
import CreateChallenge from "./features/challange/pages/CreateChallange";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/follower" element={<Followers />} />
        <Route path="/following" element={<Following />} />
        <Route path="/challange/create" element={<CreateChallenge />} />
        

        {/* Challenge Routes */}
        <Route
          path="/challangeFeed"
          element={
            <ChallengeProvider>
              <ChallengeFeed />
            </ChallengeProvider>
          }
        />

        <Route
          path="/streakPage"
          element={
            <ChallengeProvider>
              <HeatmapPage />
            </ChallengeProvider>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;