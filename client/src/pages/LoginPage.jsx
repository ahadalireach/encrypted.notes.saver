import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthState } from "../redux/slices/authSlice";
import { LockClosedIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo, success } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userInfo) {
      navigate("/notes");
    }

    if (success) {
      toast.success("Login successful");
      dispatch(resetAuthState());
    }

    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Something went wrong";
      toast.error(errorMessage);
      dispatch(resetAuthState());
    }
  }, [userInfo, success, error, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <LockClosedIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Login to SecureNotes
          </h1>
          <p className="text-gray-600 mt-2">
            Access your encrypted notes securely
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md  transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader size="small" /> : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
