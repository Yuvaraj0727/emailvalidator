import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_MAILBOXLAYER_API_KEY;

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    setError("");
    
    if (!email) {
      setError("Please enter an email address.");
      return;
    }

    setLoading(true);
    try {

      // API call to validate Email
      const response = await fetch(
        `http://apilayer.net/api/check?access_key=${API_KEY}&email=${email}&smtp=1&format=1`
      );

      const data = await response.json();

      if (data.success === false) {
        setError("API request failed: " + data.error?.info);
      } else if (data.score > 0.5) {
        navigate("/weather");
      } else {
        setError("❌ Email seems invalid. Try another one.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full border border-gray-200">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Please enter your email address to continue to the next screen.
        </p>

        {/* Input Filed */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:bg-blue-300"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Error message */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-700 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
