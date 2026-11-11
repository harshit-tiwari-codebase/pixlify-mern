import { createContext, useState, useEffect } from "react";
import { login, register, logout, getMe } from "./services/auth.api";

export const authContext = createContext();

export function AuthProvider({ children }) {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login
  const handleLogin = async (username, password) => {
    setloading(true);
    try {
      const response = await login(username, password);
      setuser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  // Register
  const handleRegister = async (username, email, password) => {
    setloading(true);
    try {
      const response = await register(username, email, password);
      setuser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setuser(null);
    }
  };

  // Restore logged in user
  const handleGetMe = async () => {
    try {
      const response = await getMe();
      setuser({
        ...response.user,
        followersCount: response.followersCount,
        followingCount: response.followingCount,
        followers: response.followers,
        following: response.following,
        posts: response.posts,
      });
      return response;
    } catch (error) {
      setuser(null);
      return null;
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <authContext.Provider
      value={{
        user,
        setuser,
        loading,
        checkingAuth,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
