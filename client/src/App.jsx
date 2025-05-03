/* eslint-disable react-hooks/exhaustive-deps */
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotesPage from "./pages/NotesPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import CreateNotePage from "./pages/CreateNotePage";
import EditNotePage from "./pages/EditNotePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import GeoRestrictionError from "./components/GeoRestrictionError";
import Layout from "./components/Layout";
import { checkGeoBlockStatus } from "./utils/geoCheckUtils";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [geoError, setGeoError] = useState(false);
  const [geoMessage, setGeoMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedError = localStorage.getItem("geoBlockError");

    if (storedError) {
      const errorData = JSON.parse(storedError);
      setGeoError(true);
      setGeoMessage(errorData.message || "Access blocked.");

      checkGeoBlockStatus().then((blockLifted) => {
        if (blockLifted) {
          setGeoError(false);
          navigate(location.pathname, { replace: true });
        }
      });
    }

    const handleGeoBlock = (e) => {
      setGeoError(true);
      setGeoMessage(e.detail?.message || "Access blocked.");
    };

    window.addEventListener("geoBlockError", handleGeoBlock);

    return () => {
      window.removeEventListener("geoBlockError", handleGeoBlock);
    };
  }, [location]);

  if (geoError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GeoRestrictionError message={geoMessage} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route
            path="notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notes/:id"
            element={
              <ProtectedRoute>
                <NoteDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notes/create"
            element={
              <ProtectedRoute>
                <CreateNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="notes/edit/:id"
            element={
              <ProtectedRoute>
                <EditNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
