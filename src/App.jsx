import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { api } from "./services/api";
import {
  SignupPage,
  LoginPage,
  OTPPage,
  Dashboard,
} from "./pages";

const buildUserData = (userFromSession) => ({
  _id: userFromSession._id,
  email: userFromSession.email,
  firstName:
    (userFromSession.fullName?.split(" ")[0] || userFromSession.userName) ??
    "User",
  lastName:
    (userFromSession.fullName?.split(" ").slice(1).join(" ")) ?? "",
  userName: userFromSession.userName,
  fullName: userFromSession.fullName,
  profilePic: userFromSession.profilePic,
});

const MainApp = () => {
  const { user, login } = useAuth();
  const [currentView, setCurrentView] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(false);

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
        const userFromSession = result?.user ?? result?.data ?? result;
        const hasUser =
          userFromSession && userFromSession._id && userFromSession.email;

        if (hasUser) {
          login(buildUserData(userFromSession));
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

export default App;
