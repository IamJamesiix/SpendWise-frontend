import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { PasswordInput } from "../components/PasswordInput";

export const LoginPage = ({ onSwitchToSignup, onNeedsVerification }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await api.login(formData);

      if (result.needsVerification && result.email) {
        setError("Please verify your email first");
        setTimeout(() => onNeedsVerification(result.email), 1500);
        return;
      }

      if (result._id && result.email) {
        login({
          _id: result._id,
          email: result.email,
          firstName: result.fullName?.split(" ")[0] || result.userName,
          lastName: result.fullName?.split(" ").slice(1).join(" ") || "",
          userName: result.userName,
          fullName: result.fullName,
          profilePic: result.profilePic,
        });
        navigate("/dashboard", { replace: true });
      } else {
        setError(
          typeof result === "string"
            ? result
            : result.error ||
                result.message ||
                "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-purple-500/20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Log in to manage your finances</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <GoogleSignInButton text="Continue with Google" />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-900 text-gray-400">
            Or continue with email
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <PasswordInput
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-gray-400 mt-6">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-purple-400 font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};
