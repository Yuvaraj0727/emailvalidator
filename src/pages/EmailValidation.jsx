import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle email verification
  const handleVerify = async () => {
    setError("");

    if (!email) {
      setError("Please enter an email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/verify-email?email=${email}`
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Email verified successfully:", data);

        if (data.score > 0.5) {
          Cookies.set("email", data.email);
          Cookies.set("user", data.user);
          setSuccess(`Score is ${data.score}. Email verified successfully!`);
          setTimeout(() => {
            navigate("/weather");
          }, 2000);
        } else {
          setError(`Score is ${data.score} . Try another one.`);
        }
      } else {
        setError(`Email seems invalid. Try another one.`);
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-200 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 max-w-lg w-full transition-all duration-300">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-2 tracking-tight">
          Verify Email
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Enter your email address to continue.
        </p>

        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-5 bg-red-200 text-red-800 text-sm text-center font-medium p-3 rounded-md shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-5 bg-green-200 text-green-800 text-sm text-center font-medium p-3 rounded-md shadow-sm">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
