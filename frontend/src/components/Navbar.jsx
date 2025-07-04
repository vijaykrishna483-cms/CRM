import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiLogin, HiLogout } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "COLLEGE", path: "/college" },
    { label: "EMPLOYEE", path: "/employee" },
    { label: "TRAINER", path: "/trainer" },
    { label: "EXAM", path: "/exam" },
    { label: "TEF", path: "/tef" },
    { label: "PAYSLIP", path: "/invoice" },
    { label: "TOE", path: "/toe" },
    { label: "TDS", path: "/tds" },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";
  const showTransparent = isHome && !scrolled;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div
      className={`w-full fixed z-50 transition duration-300  ${
        showTransparent
          ? "bg-transparent text-white"
          : "bg-white text-black  shadow-sm"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
        <div className="text-base font-bold text-center md:text-left">
          SMART TRAINING RESOURCES INDIA PVT. LTD.
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-6 mt-4 md:mt-0 text-sm font-medium items-center">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer transition duration-150 hover:text-[#000] 
 ${
   showTransparent
     ? "bg-transparent text-white"
     : "bg-white text-black  "
 }                ${
                location.pathname === item.path
                  ? "text-[#fff] font-semibold border-b-2 border-[#000] pb-1"
                  : ""
              }`}
            >
              {item.label}
            </div>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition duration-200 shadow-sm ml-4 ${
                showTransparent
                  ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                  : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
              }`}
            >
              <HiLogout className="text-lg" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition duration-200 shadow-sm ml-4 ${
                showTransparent
                  ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                  : "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
              }`}
            >
              <HiLogin className="text-lg" />
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
