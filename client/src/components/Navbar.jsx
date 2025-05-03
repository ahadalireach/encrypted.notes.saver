import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import logo from "/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-200 transition-colors">
              Home
            </Link>
            {userInfo ? (
              <>
                <Link
                  to="/notes"
                  className="hover:text-indigo-200 transition-colors"
                >
                  My Notes
                </Link>
                <Link
                  to="/notes/create"
                  className="hover:text-indigo-200 transition-colors"
                >
                  Create Note
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-indigo-200 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-indigo-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block hover:text-indigo-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {userInfo ? (
              <>
                <Link
                  to="/notes"
                  className="block hover:text-indigo-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Notes
                </Link>
                <Link
                  to="/notes/create"
                  className="block hover:text-indigo-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Create Note
                </Link>
                <Link
                  to="/profile"
                  className="block hover:text-indigo-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-indigo-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
