import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const { data } = await api.post("/auth/google", googleData);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success(`Successfully signed in as ${data.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Google authentication failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully");
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === "admin",
        isProvider: user?.role === "provider" || user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
