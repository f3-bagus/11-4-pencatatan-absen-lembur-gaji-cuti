import React, { useContext } from "react";
import { Spinner, Center } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="green.500"
          size="xl"
        />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.data.role !== role) {
    return <Navigate to={`/${user.data.role}`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
