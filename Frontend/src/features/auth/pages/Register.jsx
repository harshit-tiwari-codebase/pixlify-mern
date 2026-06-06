import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { handleRegister , loading } = useAuth();

  const navigate = useNavigate();

  async function registerHandler(e) {
    e.preventDefault();

    try {
      const response = await handleRegister(username, email, password)
      toast.success("Account is created Successfully")
      setTimeout(() => {
         navigate("/login")
      }, 1000);
      console.log(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Register failed"
      );
    }
  }

    


  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Join Pixlify and start sharing your moments
        </p>

        <form onSubmit={registerHandler} className="flex flex-col gap-5">
          <input
            type="text"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            placeholder="Email"
            required={true}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
          />

          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
          />

          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition"
          />

           <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Registering " : "Registered"}
          </button>
        </form>
        <p className="text-zinc-400 text-center mt-6">
          Alreay have an Account{" "}
          <Link className="text-blue-400 hover:text-blue-300" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
