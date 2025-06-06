import { Link, Outlet, useLocation } from "react-router-dom";

import teamIcon from "../assets/team.svg";
import galleryIcon from "../assets/gallery.svg";

const Layout = () => {
  const location = useLocation();
  const isOrgActive =
    location.pathname === "/organisations" ||
    location.pathname === "/organization";
  const isGalleryActive = location.pathname === "/gallery";

  return (
    <div className="flex flex-col h-screen items-center overflow-hidden bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-[#e3e6d3] border-b border-gray-200 px-4 sm:px-6 py-3 w-full max-w-md mx-auto rounded-b-[15px]">
        <div className="flex justify-center items-center gap-x-8">
          <Link
            to="/organisations"
            className={`flex items-center gap-x-2 px-3 py-2 rounded-lg transition-colors font-medium ${
              isOrgActive
                ? "bg-white text-[#7a7a3a] shadow font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <img src={teamIcon} alt="Organization" className="w-5 h-5" />
            <span>Organisations</span>
          </Link>
          <Link
            to="/gallery"
            className={`flex items-center gap-x-2 px-3 py-2 rounded-lg transition-colors font-medium ${
              isGalleryActive
                ? "bg-white text-[#7a7a3a] shadow font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <img src={galleryIcon} alt="Gallery" className="w-5 h-5" />
            <span>Gallery</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
