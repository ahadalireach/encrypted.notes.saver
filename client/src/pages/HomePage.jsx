import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";
// import GetIP from "../components/GetIP";

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-6xl mx-auto">
      <section className="py-12 md:py-20 text-center">
        {/* <GetIP /> */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-700">
          Secure Your Notes with Military-Grade Encryption
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          SecureNotes provides end-to-end encrypted note-taking with
          zero-knowledge security. Your data remains private, even in the event
          of a data breach.
        </p>

        {userInfo ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/notes"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              My Notes
            </Link>
            <Link
              to="/notes/create"
              className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Create New Note
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 rounded-xl my-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Advanced Security Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <LockClosedIcon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AES-256 Encryption</h3>
              <p className="text-gray-600">
                All your notes are encrypted with AES-256, the same encryption
                standard used by governments and military organizations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <ShieldCheckIcon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Zero-Knowledge Security
              </h3>
              <p className="text-gray-600">
                We can't read your notes, even if we wanted to. Your encryption
                keys never leave your device.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 mb-4">
                <DocumentTextIcon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Markdown Support</h3>
              <p className="text-gray-600">
                Write formatted notes with Markdown syntax while maintaining
                complete security and privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Ready to secure your notes?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of users who trust SecureNotes for their private
          information.
        </p>

        {!userInfo && (
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Your Free Account
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
