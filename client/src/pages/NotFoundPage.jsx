import { Link } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/outline";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
      >
        <HomeIcon className="h-5 w-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
