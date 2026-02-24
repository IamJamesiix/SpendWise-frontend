import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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

const extractUserFromSession = (result) => {
  if (!result || typeof result !== "object") return null;
  if (result.user && result.user.email) return result.user;
  if (result.data?.user && result.data.user.email) return result.data.user;
  if (result.data && result.data.email) return result.data;
  if (result._id && result.email) return result;
  if (result.id && result.email) return result;
  return null;
};

export const AuthLoader = ({ children }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // ✅ Extract token from URL for OAuth cross-domain fix
  // Backend sends: /?oauth=success&token=xxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      sessionStorage.setItem("authToken", token);
      // Clean token from URL immediately for security
      window.history.replaceState({}, document.title, "/?oauth=success");
    }
  }, []);

  const isOAuthReturn = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.location.search.includes("oauth=success") ||
      window.sessionStorage.getItem("oauthInProgress") === "true"
    );
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: api.checkSession,
    enabled: isOAuthReturn ? true : !user,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!data) return;

    // Already logged in — just clean URL if needed
    if (user) {
      if (window.location.search.includes("oauth=success")) {
        window.history.replaceState({}, document.title, "/");
      }
      return;
    }

    const userFromSession = extractUserFromSession(data);
    window.sessionStorage.removeItem("oauthInProgress");

    if (userFromSession) {
      login(buildUserData(userFromSession));
      window.history.replaceState({}, document.title, "/");
      if (isOAuthReturn) {
        navigate("/dashboard", { replace: true });
      }
    } else {
      window.history.replaceState({}, document.title, "/");
    }
  }, [data]);

  if (!user && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  return children;
};