import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

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

/**
 * Try to pull a user object out of various possible backend response shapes.
 * Supports:
 * - { user: {...} }
 * - { data: { user: {...} } }
 * - { data: {...user fields...} }
 * - { _id, email, ... } or { id, email, ... } at the top level
 */
const extractUserFromSession = (result) => {
  if (!result || typeof result !== "object") return null;

  if (result.user && result.user.email) return result.user;
  if (result.data?.user && result.data.user.email) return result.data.user;
  if (result.data && result.data.email) return result.data;

  if (result._id && result.email) return result;
  if (result.id && result.email) return result;

  return null;
};

/**
 * Runs session check once on app load so we restore the user even when
 * landing on /dashboard (e.g. after OAuth redirect). Renders children
 * after the check is done.
 */
export const AuthLoader = ({ children }) => {
  const { user, login } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      setChecking(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const result = await api.checkSession();
        const userFromSession = extractUserFromSession(result);

        if (userFromSession) {
          login(buildUserData(userFromSession));
          const path = window.location.pathname || "/";
          const cleanUrl = path + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setChecking(false);
      }
    };

    restoreSession();
  }, [user, login]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  return children;
};
