import React from "react";
import { FaLock, FaMapMarkerAlt, FaShieldAlt, FaRedoAlt } from "react-icons/fa";

const GeoRestrictionError = ({ message }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-indigo-100 via-red-50 to-white text-indigo-600 rounded-xl shadow-2xl backdrop-blur-md border border-red-200/40 animate-fade-in">
      <div className="bg-red-600 p-5 rounded-full shadow-md mb-4 animate-bounce">
        <FaLock className="text-white text-4xl" />
      </div>

      <h1 className="text-3xl font-extrabold text-red-700 mb-3 tracking-tight">
        Access Restricted – SecureNotes
      </h1>

      <p className="text-center text-gray-800 max-w-md mb-6 text-base">
        {message ||
          "SecureNotes is exclusively available to users located in Pakistan. Use of VPNs, proxies, or anonymizers is strictly prohibited."}
      </p>

      <p className="text-center text-red-700 font-medium mb-6">
        Please turn off your VPN or proxy and try reloading the page.
      </p>

      <button
        onClick={handleReload}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
      >
        <FaRedoAlt className="text-sm" />
        Reload Page
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-10">
        <div className="bg-white/60 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <FaMapMarkerAlt className="text-green-600 mr-2 text-xl" />
            <h3 className="font-semibold text-lg">Pakistan Only</h3>
          </div>
          <p className="text-sm text-gray-700">
            SecureNotes is optimized for legal, verified access from within
            Pakistan only.
          </p>
        </div>

        <div className="bg-white/60 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <FaShieldAlt className="text-blue-600 mr-2 text-xl" />
            <h3 className="font-semibold text-lg">Security Measures</h3>
          </div>
          <p className="text-sm text-gray-700">
            To ensure privacy and security, access via VPNs, proxies, or cloud
            IPs is denied.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeoRestrictionError;
