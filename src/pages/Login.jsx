import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import googleLogo from "../assets/google.png";

import { ROUTES } from "../config/constants";
import { authService } from "../services/authService";
import { constructGoogleAuthUrl, redirectToGoogle } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    const authUrl = constructGoogleAuthUrl();
    redirectToGoogle(authUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#acb3846b]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#fff] bg-[#acb384] hover:bg-[#acb384] focus:outline-none"
          >
            <img
              src={googleLogo}
              alt="Google Logo"
              className="w-5 h-5 object-contain"
            />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
