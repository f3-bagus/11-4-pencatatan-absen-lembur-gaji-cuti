import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { BASE_URL } from "../api/BASE_URL"; 

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
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedUser.token}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (nip, password, rememberMe) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { nip, password });
      const userData = response.data;
      setUser(userData);
      setIsLogin(true);

      if (rememberMe) {
        localStorage.setItem("nip", nip);
        localStorage.setItem("password", password);
      }

      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      navigate(`/${userData.data.role}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
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
      await axios.post(`${BASE_URL}/api/auth/logout`);
      setUser(null);
      setIsLogin(false);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed";
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

  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`${BASE_URL}/${endpoint}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Fetch data failed";
      toast({
        title: "Fetch data failed.",
        description: errorMessage,
        position: "top-left",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchData }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
