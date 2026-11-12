import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { handleRegister, loading } = useAuth();

  const navigate = useNavigate();

  async function registerHandler(e) {
    e.preventDefault();

    try {
      await handleRegister(username, email, password);
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Register failed"
      );
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border-[2.5px] border-black rounded-[32px] p-6 sm:p-8 shadow-[5px_5px_0px_#000]">
        {/* Brand */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-black inline-block mb-1">
            pixlify<span className="text-[#FF6B4A]">.</span>
          </h2>
          <h1 className="text-xl font-extrabold text-black mt-2">
            Create Account
          </h1>
          <p className="text-xs text-zinc-600 font-medium mt-1">
            Join the community and start sharing your moments.
          </p>
        </div>

        <form onSubmit={registerHandler} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border-2 border-black text-black text-sm placeholder-zinc-500 outline-none focus:shadow-[2px_2px_0px_#000] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1.5">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border-2 border-black text-black text-sm placeholder-zinc-500 outline-none focus:shadow-[2px_2px_0px_#000] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1.5">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border-2 border-black text-black text-sm placeholder-zinc-500 outline-none focus:shadow-[2px_2px_0px_#000] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username || !email || !password}
            className="mt-2 py-3.5 rounded-full bg-[#FF6B4A] hover:bg-[#ff5a36] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider border-2 border-black transition shadow-[3px_3px_0px_#000] active:scale-95"
          >
            {loading ? "Registering..." : "Join Pixlify"}
          </button>
        </form>

        <p className="text-xs text-zinc-600 text-center mt-6 font-semibold">
          Already have an account?{" "}
          <Link className="text-black font-extrabold underline hover:text-[#FF6B4A]" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
