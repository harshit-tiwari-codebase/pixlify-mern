import React from "react";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./features/auth/auth.context";
import { PostContextProvider } from "./features/post/post.context";

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <div className="w-full h-screen bg-[#111111] text-white">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
          <AppRoutes />
        </div>
      </PostContextProvider>
    </AuthProvider>
  );
};

export default App;
