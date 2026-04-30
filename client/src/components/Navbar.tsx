import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  return (
    <>
      <nav className="flex items-center w-full px-6 md:px-10 py-4 justify-between text-slate-100 bg-transparent">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="h-5 sm:h-7" />
        </Link>
        <div
          id="menu"
          className={`${mobileOpen ? "max-md:left-0" : "max-md:-left-full"} max-md:fixed max-md:bg-black/40 max-md:backdrop-blur max-md:top-0 transition-all duration-300 max-md:h-screen max-md:w-full max-md:z-50 max-md:justify-center flex-col md:static md:bg-transparent md:backdrop-blur-none md:h-auto md:w-auto md:z-auto md:flex-row flex items-center gap-1 text-sm`}
        >
          <Link
            className="px-4 py-2 text-slate-100 hover:text-white transition-colors"
            to="/"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            className="px-4 py-2 text-slate-100 hover:text-white transition-colors"
            to="/projects"
            onClick={() => setMobileOpen(false)}
          >
            My Projects
          </Link>
          <Link
            className="px-4 py-2 text-slate-100 hover:text-white transition-colors"
            to="/community"
            onClick={() => setMobileOpen(false)}
          >
            Community
          </Link>
          <Link
            className="px-4 py-2 text-slate-100 hover:text-white transition-colors"
            to="/pricing"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth/signin")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition cursor-pointer"
          >
            Get started
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden"
            aria-label="Open menu"
          >
            <svg
              className="size-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
