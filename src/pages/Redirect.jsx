import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

import { setToken } from "../utils/auth";
import { authenticateWithCode } from "../api/auth";
import { CONFIG } from "../App";

const Redirect = ({ env }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        if (!code) {
          toast.error("Authentication failed: No code received");
          navigate("/login");
          return;
        }

        const { access_token } = await authenticateWithCode(CONFIG[env], code);
        setToken(access_token);
        navigate("/organisations");
      } catch (error) {
        error;
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    };

    handleAuthentication();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
};

export default Redirect;
