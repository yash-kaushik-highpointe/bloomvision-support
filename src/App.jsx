import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Gallery from "./pages/Gallery";
import Polotno from "./pages/Polotno";
import Redirect from "./pages/Redirect";
import Template from "./pages/Template";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

import { ROUTES } from "./config/constants";
import { authService } from "./services/authService";
import { clearFlowers } from "./store/slices/flowersSlice";
import { clearAllTemplates } from "./store/slices/polotnoSlice";

import "react-toastify/dist/ReactToastify.css";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to={ROUTES.LOGIN} />
  );
};

export const CONFIG = {
  prod: import.meta.env.VITE_API_PROD_BASE_URL,
  dev: import.meta.env.VITE_API_BASE_URL,
};

function App() {
  const dispatch = useDispatch();
  const [env, setEnv] = useState("dev");

  const handleEnvChange = (e) => {
    setEnv((prev) => (prev === "dev" ? "prod" : "dev"));
  };

  useEffect(() => {
    dispatch(clearFlowers());
    dispatch(clearAllTemplates());
  }, [env]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/redirect" element={<Redirect env={env} />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout env={env} handleEnvChange={handleEnvChange} />
            </ProtectedRoute>
          }
        >
          <Route path="/gallery" element={<Gallery env={env} />} />
          <Route path="/upload" element={<Upload env={env} />} />
          <Route path="/organisations" element={<Dashboard env={env} />} />
          <Route path="/template" element={<Template env={env} />} />
          <Route path="/template/:id" element={<Polotno env={env} />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
