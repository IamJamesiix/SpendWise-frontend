import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const buildUserData = (userFromSession) => ({
  _id: userFromSession._id,
  email: userFromSession.email,
  firstName:
    (userFromSession.fullName?.split(" ")[0] || userFromSession.userName) ??
    "User",
  lastName: userFromSession.fullName?.split(" ").slice(1).join(" ") ?? "",
  userName: userFromSession.userName,
  fullName: userFromSession.fullName,
  profilePic: userFromSession.profilePic,
});

export const OTPPage = ({ email, onVerified }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await api.verifyEmail({ email, otp: otpCode });
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
        setError("");
        login(buildUserData(userFromResponse));
        navigate("/dashboard", { replace: true });
      } else if (isEmailVerifiedSuccess) {
        setError("");
        const sessionResult = await api.checkSession();
        const userFromSession =
          sessionResult?.user ?? sessionResult?.data ?? sessionResult;
        if (userFromSession?._id && userFromSession?.email) {
          login(buildUserData(userFromSession));
          navigate("/dashboard", { replace: true });
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
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const result = await api.resendOTP(email);
      if (result.error) setError(result.error);
      else if (result.message) setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
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
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-left">
          <p className="text-yellow-400 text-xs">
            ⚠️ Can't find the email? Check your{" "}
            <span className="font-semibold">spam or junk folder</span>.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            ⏱ This code expires in{" "}
            <span className="font-semibold text-white">5 minutes</span>.
          </p>
        </div>
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