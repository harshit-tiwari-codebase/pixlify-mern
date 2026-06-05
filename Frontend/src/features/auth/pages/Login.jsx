import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const { handleLogin, loading } = useAuth();

  const navigate = useNavigate();
  async function loginHandler(e) {
    e.preventDefault();

    try {
      const response = await handleLogin(username, password);

      toast.success("Welcome to pixlify");
      setTimeout(() => {
        navigate("/feed");
      }, 1000);
      console.log(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login failed",
      );
    }
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-zinc-950 via-slate-900 to-black flex items-center justify-center px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full top-20 left-20"></div>
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full bottom-20 right-20"></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/[0.07] border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <h1 className="text-4xl font-bold text-white text-center">
          Welcome Back
        </h1>

        <p className="text-zinc-400 text-center mt-2 mb-8">
          Sign in to continue to pixlify
        </p>

        <form onSubmit={loginHandler} className="flex flex-col gap-5">
          <input
            type="text"
            autoComplete="username"
            onChange={(e) => {
              setusername(e.target.value);
            }}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
          />

          <input
            type="password"
            autoComplete="current-password"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-zinc-400 text-center mt-6">
          Don't have an account?{" "}
          <Link className="text-blue-400 hover:text-blue-300" to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
