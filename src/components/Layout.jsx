import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import teamIcon from "../assets/team.svg";
import galleryIcon from "../assets/gallery.svg";
import templateIcon from "../assets/bouquet.svg";

// Toggle Switch Component
const ToggleSwitch = ({ isOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7a7a3a] focus:ring-offset-2 ${
        isOn ? "bg-[#7a7a3a]" : "bg-gray-300"
      }`}
      role="switch"
      aria-checked={isOn}
    >
      {/* Dev Text - visible when toggle is OFF */}
      <span
        className={`absolute right-3 text-xs font-medium transition-opacity ${
          isOn ? "opacity-0" : "opacity-100"
        } ${isOn ? "text-transparent" : "text-gray-600"}`}
      >
        Dev
      </span>

      {/* Prod Text - visible when toggle is ON */}
      <span
        className={`absolute left-2 text-xs font-medium transition-opacity ${
          isOn ? "opacity-100" : "opacity-0"
        } ${isOn ? "text-white" : "text-transparent"}`}
      >
        Prod
      </span>

      {/* Toggle Circle */}
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isOn ? "translate-x-10" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const Layout = ({ handleEnvChange }) => {
  const location = useLocation();
  const [isToggleOn, setIsToggleOn] = useState(false);

  const isOrgActive =
    location.pathname === "/organisations" ||
    location.pathname === "/organization";
  const isGalleryActive = location.pathname === "/gallery";
  const isTemplateActive = location.pathname === "/template";

  const disableEnvToggle = location.pathname.includes("/template/");

  const handleToggle = () => {
    setIsToggleOn((prev) => !prev);
    handleEnvChange(!isToggleOn ? "prod" : "dev");
  };

  return (
    <div className="relative flex flex-col h-screen items-center overflow-hidden bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-[#e3e6d3] border-b border-gray-200 px-4 sm:px-6 py-3 w-full max-w-[500px] mx-auto rounded-b-[15px]">
        <div className="flex justify-center items-center gap-x-8">
          <Link
            to="/organisations"
            className={`flex items-center gap-x-2 px-3 py-2 rounded-lg transition-colors font-medium no-underline hover:no-underline hover:text-[#7a7a3a] focus:outline-none focus:ring-0 ${
              isOrgActive
                ? "bg-white text-[#7a7a3a] shadow font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <img src={teamIcon} alt="Organization" className="w-5 h-5" />
            <span className="hover:no-underline">Organisations</span>
          </Link>
          <Link
            to="/gallery"
            className={`flex items-center gap-x-2 px-3 py-2 rounded-lg transition-colors font-medium no-underline hover:no-underline hover:text-[#7a7a3a] focus:outline-none focus:ring-0  ${
              isGalleryActive
                ? "bg-white text-[#7a7a3a] shadow font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <img src={galleryIcon} alt="Gallery" className="w-5 h-5" />
            <span className="hover:no-underline">Gallery</span>
          </Link>
          <Link
            to="/template"
            className={`flex items-center gap-x-2 px-3 py-2 rounded-lg transition-colors font-medium no-underline hover:no-underline hover:text-[#7a7a3a] focus:outline-none focus:ring-0 ${
              isTemplateActive || disableEnvToggle
                ? "bg-white text-[#7a7a3a] shadow font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <img src={templateIcon} alt="Template" className="w-5 h-5" />
            <span className="hover:no-underline">Template</span>
          </Link>
        </div>
      </nav>

      {!disableEnvToggle && (
        <div className="absolute right-10 top-[1.5rem] ">
          <ToggleSwitch isOn={isToggleOn} onToggle={handleToggle} />
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 w-full overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
