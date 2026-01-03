import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }
    try {
      JSON.parse(atob(token.split(".")[1]));
      setStatus("allowed");
    } catch {
      setStatus("unauth");
    }
  }, []);

  if (status === "loading") return null;

  if (status === "unauth") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

