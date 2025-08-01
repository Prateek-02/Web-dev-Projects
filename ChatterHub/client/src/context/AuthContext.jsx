import { createContext, useState, useEffect } from "react";
import axios from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("chatter-user")) || null);

  const login = async (formData) => {
    const { data } = await axios.post("/auth/login", formData);
    setUser(data);
    localStorage.setItem("chatter-user", JSON.stringify(data));
  };

  const register = async (formData) => {
    const { data } = await axios.post("/auth/register", formData);
    setUser(data);
    localStorage.setItem("chatter-user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("chatter-user");
  };

  useEffect(() => {
    const saved = localStorage.getItem("chatter-user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
