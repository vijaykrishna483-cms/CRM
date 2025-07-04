import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [status, setStatus] = useState("loading"); // "loading", "allowed", "admin", "unauth"

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const verticalId = Number(payload?.vertical_id);
      if (verticalId != 5) {
        setStatus("admin");
      } else {
        setStatus("allowed");  // <--- THIS LINE IS THE FIX!
      }
    } catch {
      setStatus("unauth");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#014036]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#014036" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="#014036" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="ml-3 text-[#014036] font-semibold">Loading...</span>
      </div>
    );
  }

  if (status === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (status === "unauth") {
    return <Navigate to="/" replace />;
  }

  // status === "allowed"
  return <Outlet />;
};

export default PrivateRoute;
