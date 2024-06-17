import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to={`/${user.data.role}`} />;
  }

  return <Outlet />;
};

export default PublicRoute;
