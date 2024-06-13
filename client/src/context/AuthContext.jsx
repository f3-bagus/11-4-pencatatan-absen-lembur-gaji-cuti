import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (nip, password, rememberMe) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { nip, password }
      );
      const userData = response.data;
      setUser(userData);
      setIsLogin(true);

      if (rememberMe) {
        //localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
        localStorage.setItem("nip", nip);
        localStorage.setItem("password", password);
      }

      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`;
      navigate(`/${userData.data.role}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      //console.error("Login failed", error);
      toast({
        title: "Login failed.",
        description: errorMessage,
        position: "top-left",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      setUser(null);
      setIsLogin(false);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
      //console.error("Login failed", error);
      toast({
        title: "Logout failed.",
        description: errorMessage,
        position: "top-left",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
