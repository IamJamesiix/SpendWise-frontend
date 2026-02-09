import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthLoader } from "./contexts/AuthLoader";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SignupPage, LoginPage, OTPPage, Dashboard } from "./pages";

const MainApp = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("login");
  const [pendingEmail, setPendingEmail] = useState("");

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
      <AuthLoader>
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
      </AuthLoader>
    </AuthProvider>
  );
}

export default App;
