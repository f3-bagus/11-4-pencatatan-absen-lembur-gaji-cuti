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
      const response = await axios.post(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/auth/login",
        { nip, password }
      );
      const userData = response.data;
      setUser(userData);
      setIsLogin(true);

      if (rememberMe) {
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
      await axios.post(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/auth/logout"
      );
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

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
