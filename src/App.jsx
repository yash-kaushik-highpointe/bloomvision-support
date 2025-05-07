import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import Redirect from "./pages/Redirect";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

import { ROUTES } from "./config/constants";
import { authService } from "./services/authService";

import "react-toastify/dist/ReactToastify.css";
import Upload from "./pages/Upload";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to={ROUTES.LOGIN} />
  );
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/redirect" element={<Redirect />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/organisations" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
