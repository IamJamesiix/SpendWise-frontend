import React, { useState, createContext, useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  PieChart,
  ArrowRight,
  Mail,
  Lock,
  User,
  Check,
  Plus,
  MessageCircle,
  Gift,
  FileText,
  LogOut,
  Home,
  DollarSign,
  Brain,
  X,
  Send,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

/** Redirects to / if not logged in; use for dashboard route */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// API Service — use env in production, fallback for local dev
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3030/cny";

const api = {
  checkSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        return { authenticated: false };
      }

      const result = await response.json();
      console.log("Session API response:", result);
      return result;
    } catch (error) {
      console.error("Session check error:", error);
      return { authenticated: false };
    }
  },

  signup: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Signup API response:", result);
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Failed to connect to server" };
    }
  },

  verifyEmail: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for JWT cookie
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Verify email API response:", result);
      return result;
    } catch (error) {
      console.error("Verify email error:", error);
      return { success: false, message: "Failed to verify email" };
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      console.log("Resend OTP API response:", result);
      return result;
    } catch (error) {
      console.error("Resend OTP error:", error);
      return { success: false, message: "Failed to resend OTP" };
    }
  },

  login: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Login API response:", result);
      return result;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Failed to connect to server" };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to logout" };
    }
  },

  getBudget: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/getBudget`, {
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: true, budgets: [] };
    }
  },

  setBudget: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/setBudget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to create budget" };
    }
  },

  chatWithAI: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: true,
        response: "Sorry, I encountered an error. Please try again.",
      };
    }
  },

  getContacts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/contacts`, {
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: true, contacts: [] };
    }
  },

  getMessagesByUserId: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: true, messages: [] };
    }
  },

  sendMessage: async (userId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to send message" };
    }
  },

  addTax: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/addTax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to add tax" };
    }
  },

  getTaxes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/getTaxes`, {
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: true, taxes: [] };
    }
  },

  deleteTax: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/deleteTax/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to delete tax" };
    }
  },
};

// Google Sign-In Button
const GoogleSignInButton = ({ text = "Continue with Google" }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Mark that we're starting OAuth flow
    sessionStorage.setItem("oauthInProgress", "true");
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/oauth/login`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {loading ? "Redirecting to Google..." : text}
    </button>
  );
};

// Animated Background
const AnimatedBackground = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
      </div>
      <div className="relative h-full flex flex-col items-center justify-center text-white px-8">
        <div className="mb-8">
          <Wallet className="w-20 h-20 mb-4 text-yellow-400" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-center">Smart Budget</h1>
        <p className="text-xl text-center mb-16 max-w-md">
          AI-powered financial planning for smarter decisions
        </p>
        <div className="space-y-8">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Track Expenses</h3>
              <p className="text-sm text-white/80">
                Monitor spending in real-time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
            <div className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <p className="text-sm text-white/80">Get personalized advice</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-xl">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Plan Gifts</h3>
              <p className="text-sm text-white/80">
                Budget for special occasions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Password Input
const PasswordInput = ({
  value,
  onChange,
  onKeyPress,
  placeholder = "••••••••",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

// Signup Page
const SignupPage = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("=== SIGNUP STARTED ===");
    console.log("Form data:", formData);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      const errorMsg = "All fields are required";
      console.error("Validation error:", errorMsg);
      setError(errorMsg);
      return;
    }

    if (formData.password.length < 8) {
      const errorMsg = "Password must be at least 8 characters";
      console.error("Validation error:", errorMsg);
      setError(errorMsg);
      return;
    }

    setError("");
    setLoading(true);
    console.log("Sending signup request to backend...");

    try {
      const result = await api.signup(formData);
      console.log("=== SIGNUP RESPONSE ===");
      console.log("Full result:", JSON.stringify(result, null, 2));

      // Backend returns { status: "success", message: "...", data: {...} } on success
      // or { status: "error", message: "..." } on failure
      if (result.status === "success") {
        console.log("✅ Signup successful! Redirecting to OTP page...");
        console.log("Email for OTP:", formData.email);
        onSignupSuccess(formData.email);
      } else {
        const errorMsg =
          typeof result === "string"
            ? result
            : result.message ||
              result.error ||
              "Signup failed. Please try again.";
        console.error("❌ Signup failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("=== SIGNUP CATCH ERROR ===");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
      console.log("=== SIGNUP ENDED ===");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-purple-500/20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">
          Join us and start your financial journey
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <GoogleSignInButton text="Sign up with Google" />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-900 text-gray-400">
            Or continue with email
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="John"
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Doe"
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
        </div>

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
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-gray-400 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-purple-400 font-semibold hover:underline"
        >
          Log In
        </button>
      </p>
    </div>
  );
};

// Login Page
const LoginPage = ({ onSwitchToSignup, onNeedsVerification }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("=== LOGIN STARTED ===");
    console.log("Form data:", { email: formData.email, password: "***" });

    if (!formData.email || !formData.password) {
      const errorMsg = "All fields are required";
      console.error("Validation error:", errorMsg);
      setError(errorMsg);
      return;
    }

    setError("");
    setLoading(true);
    console.log("Sending login request to backend...");

    try {
      const result = await api.login(formData);
      console.log("=== LOGIN RESPONSE ===");
      console.log("Full result:", JSON.stringify(result, null, 2));

      // Check if email needs verification
      if (result.needsVerification && result.email) {
        console.log("⚠️ Email not verified, redirecting to OTP page");
        setError("Please verify your email first");
        // Redirect to OTP page with the email
        setTimeout(() => {
          onNeedsVerification(result.email);
        }, 1500);
        return;
      }

      // Backend returns user object directly on success: { _id, userName, fullName, email, profilePic }
      if (result._id && result.email) {
        console.log("✅ Login successful!");
        const userData = {
          _id: result._id,
          email: result.email,
          firstName: result.fullName?.split(" ")[0] || result.userName,
          lastName: result.fullName?.split(" ").slice(1).join(" ") || "",
          userName: result.userName,
          fullName: result.fullName,
          profilePic: result.profilePic,
        };
        console.log("Setting user data:", userData);
        login(userData);
      } else {
        const errorMsg =
          typeof result === "string"
            ? result
            : result.error ||
              result.message ||
              "Login failed. Please check your credentials.";
        console.error("❌ Login failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("=== LOGIN CATCH ERROR ===");
      console.error("Error:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
      console.log("=== LOGIN ENDED ===");
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
          <div className="w-full border-t border-gray-700"></div>
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

// OTP Page
const OTPPage = ({ email, onVerified }) => {
  const { login } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    console.log("=== OTP VERIFICATION STARTED ===");
    console.log("Email:", email);
    console.log("OTP Code:", otpCode);

    if (otpCode.length !== 6) {
      const errorMsg = "Please enter all 6 digits";
      console.error("Validation error:", errorMsg);
      setError(errorMsg);
      return;
    }

    setError("");
    setLoading(true);
    console.log("Sending OTP verification request to backend...");

    try {
      const result = await api.verifyEmail({ email, otp: otpCode });
      console.log("=== OTP VERIFICATION RESPONSE ===");
      console.log("Full result:", JSON.stringify(result, null, 2));

      // Backend may return user in result.user, result.data, or flat result; success may be in message or (wrongly) in error
      const userFromResponse =
        result?.user ??
        result?.data ??
        (result?.email && result?._id ? result : null);
      const successMessage = (
        result?.message ??
        result?.error ??
        ""
      ).toLowerCase();
      const isEmailVerifiedSuccess =
        successMessage.includes("verif") || successMessage.includes("success");

      if (userFromResponse?._id && userFromResponse?.email) {
        // We have a user object — log in and go to dashboard
        setError("");
        const userData = {
          _id: userFromResponse._id,
          email: userFromResponse.email,
          firstName:
            (userFromResponse.fullName?.split(" ")[0] ||
              userFromResponse.userName) ??
            "User",
          lastName:
            userFromResponse.fullName?.split(" ").slice(1).join(" ") ?? "",
          userName: userFromResponse.userName,
          fullName: userFromResponse.fullName,
          profilePic: userFromResponse.profilePic,
        };
        login(userData);
      } else if (isEmailVerifiedSuccess) {
        // Backend said success (e.g. "Email verified") but no user in body — session cookie may be set, fetch current user
        setError("");
        const sessionResult = await api.checkSession();
        const userFromSession =
          sessionResult?.user ?? sessionResult?.data ?? sessionResult;
        if (userFromSession?._id && userFromSession?.email) {
          const userData = {
            _id: userFromSession._id,
            email: userFromSession.email,
            firstName:
              (userFromSession.fullName?.split(" ")[0] ||
                userFromSession.userName) ??
              "User",
            lastName:
              userFromSession.fullName?.split(" ").slice(1).join(" ") ?? "",
            userName: userFromSession.userName,
            fullName: userFromSession.fullName,
            profilePic: userFromSession.profilePic,
          };
          login(userData);
        } else {
          setError(
            "Verification succeeded but we couldn't load your session. Please log in."
          );
        }
      } else if (result?.error && !isEmailVerifiedSuccess) {
        setError(result.error);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("=== OTP VERIFICATION CATCH ERROR ===");
      console.error("Error object:", err);
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
      console.log("=== OTP VERIFICATION ENDED ===");
    }
  };

  const handleResend = async () => {
    console.log("=== RESEND OTP STARTED ===");
    console.log("Email:", email);
    setResending(true);
    setError("");

    try {
      const result = await api.resendOTP(email);
      console.log("=== RESEND OTP RESPONSE ===");
      console.log("Full result:", JSON.stringify(result, null, 2));

      // Backend returns { message: "Verification code resent" } on success
      // or { error: "..." } on failure
      if (result.error) {
        console.error("❌ Resend failed:", result.error);
        setError(result.error);
      } else if (result.message) {
        console.log("✅ OTP resent successfully");
        setOtp(["", "", "", "", "", ""]);
        // Optionally show success message
      }
    } catch (err) {
      console.error("=== RESEND OTP CATCH ERROR ===");
      console.error("Error:", err);
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
      console.log("=== RESEND OTP ENDED ===");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-purple-500/20">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4">
          <Mail className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">Verify Email</h2>
        <p className="text-gray-400">
          Enter the 6-digit code sent to
          <br />
          <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-center mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold bg-gray-800/50 border-2 border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
      >
        {loading ? "Verifying..." : "Verify Email"}
        <Check className="w-5 h-5" />
      </button>

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-purple-400 font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};

// HomePage
const HomePage = ({ budgets }) => {
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/80 text-sm">Total Budget</h3>
            <Wallet className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-4xl font-bold text-white">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/80 text-sm">Total Spent</h3>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-4xl font-bold text-white">
            ${totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-2xl border border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/80 text-sm">Remaining</h3>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-4xl font-bold text-white">
            ${(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Active Budgets</p>
            <p className="text-3xl font-bold text-white">{budgets.length}</p>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Savings Rate</p>
            <p className="text-3xl font-bold text-white">
              {totalBudget > 0
                ? Math.round((1 - totalSpent / totalBudget) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// BudgetsPage
const BudgetsPage = ({ budgets, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const handleCreate = async () => {
    try {
      await api.setBudget(newBudget);
      setShowModal(false);
      setNewBudget({ name: "", amount: "", category: "" });
      onRefresh();
    } catch (err) {
      console.error("Failed to create budget");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">My Budgets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, idx) => (
          <div
            key={idx}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">{budget.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{budget.category}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Budget</span>
                <span className="text-white font-bold">${budget.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Spent</span>
                <span className="text-red-400 font-bold">
                  ${budget.spent || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((budget.spent || 0) / budget.amount) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">New Budget</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Budget Name</label>
                <input
                  type="text"
                  placeholder="e.g., Groceries"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newBudget.name}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="500"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Food"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// TaxesPage
const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTax, setNewTax] = useState({
    description: "",
    amount: "",
    category: "",
  });

  useEffect(() => {
    loadTaxes();
  }, []);

  const loadTaxes = async () => {
    try {
      const result = await api.getTaxes();
      if (result.success) {
        setTaxes(result.taxes || []);
      }
    } catch (err) {
      console.error("Failed to load taxes");
    }
  };

  const handleCreate = async () => {
    try {
      await api.addTax(newTax);
      setShowModal(false);
      setNewTax({ description: "", amount: "", category: "" });
      loadTaxes();
    } catch (err) {
      console.error("Failed to create tax entry");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTax(id);
      loadTaxes();
    } catch (err) {
      console.error("Failed to delete tax");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Tax Tracker</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Tax Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {taxes.map((tax, idx) => (
          <div
            key={idx}
            className="bg-gray-800/50 p-6 rounded-2xl border border-purple-500/20"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {tax.description}
                </h3>
                <p className="text-gray-400 text-sm">{tax.category}</p>
              </div>
              <button
                onClick={() => handleDelete(tax._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-bold text-lg">
                ${tax.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">New Tax Entry</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Property Tax"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newTax.description}
                  onChange={(e) =>
                    setNewTax({ ...newTax, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newTax.amount}
                  onChange={(e) =>
                    setNewTax({ ...newTax, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Federal"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newTax.category}
                  onChange={(e) =>
                    setNewTax({ ...newTax, category: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl"
              >
                Add Tax Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AIAssistantPage
const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI financial assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const result = await api.chatWithAI(userMessage);

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.response },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">AI Assistant</h1>

      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 p-4 rounded-2xl text-white">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl disabled:opacity-50"
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ChatPage
const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const result = await api.getContacts();
      if (result.success) {
        setContacts(result.contacts || []);
      }
    } catch (err) {
      console.error("Failed to load contacts");
    }
  };

  const loadMessages = async (userId) => {
    try {
      const result = await api.getMessagesByUserId(userId);
      if (result.success) {
        setMessages(result.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedContact) return;

    try {
      await api.sendMessage(selectedContact._id, input);
      setInput("");
      loadMessages(selectedContact._id);
    } catch (err) {
      console.error("Failed to send message");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>

      <div className="grid grid-cols-3 gap-6 h-[600px]">
        <div className="bg-gray-800/50 rounded-2xl border border-purple-500/20 p-4 overflow-y-auto">
          <h3 className="text-white font-bold mb-4">Contacts</h3>
          {contacts.map((contact, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedContact(contact);
                loadMessages(contact._id);
              }}
              className="w-full p-3 mb-2 bg-gray-700/50 hover:bg-gray-700 rounded-xl text-white text-left"
            >
              {contact.firstName} {contact.lastName}
            </button>
          ))}
        </div>

        <div className="col-span-2 bg-gray-800/50 rounded-2xl border border-purple-500/20 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-purple-500/20">
                <h3 className="text-white font-bold">
                  {selectedContact.firstName} {selectedContact.lastName}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.senderId === selectedContact._id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        msg.senderId === selectedContact._id
                          ? "bg-gray-700 text-white"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-purple-500/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("homepage");
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const result = await api.getBudget();
      if (result.success) {
        setBudgets(result.budgets || []);
      }
    } catch (err) {
      console.error("Failed to load budgets");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Smart Budget
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Hi, {user?.firstName || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-gray-900/50 backdrop-blur-lg border-r border-purple-500/20 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setCurrentPage("homepage")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                currentPage === "homepage"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <Home className="w-5 h-5" />
              Home
            </button>

            <button
              onClick={() => setCurrentPage("budgets")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                currentPage === "budgets"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Budgets
            </button>

            <button
              onClick={() => setCurrentPage("taxes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                currentPage === "taxes"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <FileText className="w-5 h-5" />
              Tax Tracker
            </button>

            <button
              onClick={() => setCurrentPage("ai-assistant")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                currentPage === "ai-assistant"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <Brain className="w-5 h-5" />
              AI Assistant
            </button>

            <button
              onClick={() => setCurrentPage("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                currentPage === "messages"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Messages
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {currentPage === "homepage" && <HomePage budgets={budgets} />}
          {currentPage === "budgets" && (
            <BudgetsPage budgets={budgets} onRefresh={loadBudgets} />
          )}
          {currentPage === "taxes" && <TaxesPage />}
          {currentPage === "ai-assistant" && <AIAssistantPage />}
          {currentPage === "messages" && <ChatPage />}
        </main>
      </div>
    </div>
  );
};

// Main App
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

const MainApp = () => {
  const { user, login } = useAuth();
  const [currentView, setCurrentView] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(false); // Start false by default

  // Check for existing session on every load (covers OAuth callback and returning users)
  useEffect(() => {
    const checkAuthentication = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthSuccess = urlParams.get("oauth");
      const wasOAuthInProgress = sessionStorage.getItem("oauthInProgress");
      const isOAuthReturn = oauthSuccess === "success" || wasOAuthInProgress;

      if (isOAuthReturn) {
        setCheckingAuth(true);
        sessionStorage.removeItem("oauthInProgress");
      }

      try {
        const result = await api.checkSession();
        // Backend may return user as { _id, email, ... } or { user: { _id, email, ... } } or { data: { ... } }
        const userFromSession = result?.user ?? result?.data ?? result;
        const hasUser =
          userFromSession && userFromSession._id && userFromSession.email;

        if (hasUser) {
          const userData = {
            _id: userFromSession._id,
            email: userFromSession.email,
            firstName:
              (userFromSession.fullName?.split(" ")[0] ||
                userFromSession.userName) ??
              "User",
            lastName:
              userFromSession.fullName?.split(" ").slice(1).join(" ") ?? "",
            userName: userFromSession.userName,
            fullName: userFromSession.fullName,
            profilePic: userFromSession.profilePic,
          };
          login(userData);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname || "/"
          );
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [login]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2">
        <AnimatedBackground />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800">
        {currentView === "signup" && (
          <SignupPage
            onSwitchToLogin={() => setCurrentView("login")}
            onSignupSuccess={(email) => {
              setPendingEmail(email);
              setCurrentView("otp");
            }}
          />
        )}

        {currentView === "login" && (
          <LoginPage
            onSwitchToSignup={() => setCurrentView("signup")}
            onNeedsVerification={(email) => {
              setPendingEmail(email);
              setCurrentView("otp");
            }}
          />
        )}

        {currentView === "otp" && (
          <OTPPage
            email={pendingEmail}
            onVerified={() => setCurrentView("login")}
          />
        )}
      </div>
    </div>
  );
};

export default App;
