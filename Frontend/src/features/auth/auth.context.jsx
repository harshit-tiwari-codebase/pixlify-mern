import { createContext, useState, useEffect } from "react";
import { login, register, getMe } from "./services/auth.api";

export const authContext = createContext();

export function AuthProvider({ children }) {
  const [user, setuser] = useState(null);

  // Login/Register loading
  const [loading, setloading] = useState(false);

  // Initial authentication check loading
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login
  const handleLogin = async (username, password) => {
    setloading(true);

    try {
      await login(username, password);

      const response = await getMe();

      setuser(response);

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

      return response;
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  // Restore logged-in user
  const handleGetMe = async () => {
    try {
      const response = await getMe();

      setuser(response);

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
        loading,
        checkingAuth,
        handleLogin,
        handleRegister,
        handleGetMe,
      }}
    >
      {children}
    </authContext.Provider>
  );
}