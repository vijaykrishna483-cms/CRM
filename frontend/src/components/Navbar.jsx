import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiLogin, HiLogout, HiMenu, HiX } from "react-icons/hi";

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
    { label: "PAYSLIP", path: "/payslip" },
    { label: "INVOICE", path: "/invoice" },
    { label: "TOE", path: "/toe" },
    { label: "TDS", path: "/tds" },
     { label: "HR", path: "/hrUpdate" },


  ];

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    navigate("/");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div
      className={`w-full fixed z-50 transition duration-300 ${
        showTransparent
          ? "bg-transparent text-white"
          : "bg-white text-black shadow-sm"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
        <div className=" font-bold md:text- text text-left">
          SMART TRAINING RESOURCES INDIA PVT. LTD.
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden absolute right-6 top-4">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <HiX className="text-2xl" />
            ) : (
              <HiMenu className="text-2xl" />
            )}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-wrap justify-end gap-6 text-sm font-medium items-center">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => handleNavClick(item.path)}
              className={`cursor-pointer transition duration-150 hover:text-[#000]
                ${
                  showTransparent
                    ? "bg-transparent text-white"
                    : " text-black"
                }
                ${
                  location.pathname === item.path
                    ? "text-[#4f378a] font-semibold border-b-2 border-[#4f378a] pb-1"
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
              onClick={() => handleNavClick("/login")}
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

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "block md:hidden" : "hidden"
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-[#4f378a] shadow-lg z-50 transform transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}
            md:hidden flex flex-col`}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-bold text-base">
              Menu
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close Menu"
              className="focus:outline-none"
            >
              <HiX className="text-2xl" />
            </button>
          </div>
          <div className="flex flex-col gap-2 px-6 py-4">
            {navItems.map((item) => (
              <div
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`cursor-pointer py-2 px-2 rounded transition duration-150 hover:bg-gray-100
                  ${
                    location.pathname === item.path
                      ? "text-[#4f378a] font-semibold bg-gray-100"
                      : ""
                  }`}
              >
                {item.label}
              </div>
            ))}
            <div className="mt-4">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 w-full"
                >
                  <HiLogout className="text-lg" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick("/login")}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 w-full"
                >
                  <HiLogin className="text-lg" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
