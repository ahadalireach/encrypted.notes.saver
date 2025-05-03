import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, resetAuthState } from "../redux/slices/authSlice";
import { UserCircleIcon } from "@heroicons/react/outline";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray",
  });

  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.user.username);
      setEmail(userInfo.user.email);
    }
  }, [userInfo]);

  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully");
      dispatch(resetAuthState());
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthState());
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "gray" });
      return;
    }

    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let message = "";
    let color = "";

    if (score < 3) {
      message = "Weak";
      color = "red-500";
    } else if (score < 5) {
      message = "Moderate";
      color = "yellow-500";
    } else {
      message = "Strong";
      color = "green-500";
    }

    setPasswordStrength({ score, message, color });
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password && passwordStrength.score < 3) {
      toast.error("Password is too weak. Please choose a stronger password.");
      return;
    }

    const userData = {
      username,
      email,
    };

    if (password) {
      userData.password = password;
    }

    dispatch(updateProfile(userData));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <UserCircleIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600 mt-2">Update your account information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              minLength={3}
            />
          </div>

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
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            {password && (
              <div className="mt-1 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  ></div>
                </div>
                <span className={`ml-2 text-sm text-${passwordStrength.color}`}>
                  {passwordStrength.message}
                </span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader size="small" /> : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
