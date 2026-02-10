import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    budgetsCount: 0,
    taxesCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [budgetsRes, taxesRes] = await Promise.all([
          api.getBudget(),
          api.getTaxes(),
        ]);
        setStats({
          budgetsCount: budgetsRes?.budgets?.length || 0,
          taxesCount: taxesRes?.taxes?.length || 0,
        });
      } catch {
        setStats({ budgetsCount: 0, taxesCount: 0 });
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const initials = (() => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last || "U").toUpperCase();
  })();

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Anonymous User";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">
            Manage your account information and security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left: avatar + basic info */}
        <section className="xl:col-span-1 bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-xl shadow-purple-500/5">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/30">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs border-2 border-gray-900">
                <Shield className="w-3 h-3" />
              </span>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">{fullName}</h2>
              <p className="text-sm text-gray-400">
                {user?.userName ? `@${user.userName}` : "SpendWise member"}
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-800/60">
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-white break-all">
                    {user?.email || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-800/60">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Member since</p>
                  <p className="text-sm text-white">
                    {/* Backend doesn’t send createdAt yet; placeholder for now */}
                    Personal finance journey in progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: stats + settings */}
        <section className="xl:col-span-2 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-600/80 to-purple-800/90 border border-purple-500/40 rounded-2xl p-5 shadow-lg shadow-purple-500/25">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white/80">
                  Budget plans
                </h3>
                <DollarSign className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-3xl font-bold text-white">
                {loadingStats ? "—" : stats.budgetsCount}
              </p>
              <p className="text-xs text-purple-100/80 mt-1">
                Active monthly or category budgets you’re tracking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-600/80 to-rose-800/90 border border-pink-500/40 rounded-2xl p-5 shadow-lg shadow-pink-500/25">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white/80">
                  Tax records
                </h3>
                <FileText className="w-5 h-5 text-orange-200" />
              </div>
              <p className="text-3xl font-bold text-white">
                {loadingStats ? "—" : stats.taxesCount}
              </p>
              <p className="text-xs text-rose-100/80 mt-1">
                Saved tax entries to keep your filings organised.
              </p>
            </div>
          </div>

          {/* Security section (read-only for now) */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Security overview
                </h3>
                <p className="text-xs text-gray-400">
                  Your account uses email + OTP and optional Google sign‑in.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-400">Authentication methods</p>
                <p className="text-white flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Email + password / OTP
                </p>
                <p className="text-white flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Google OAuth
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-400">Session</p>
                <p className="text-white">
                  Managed via secure cookies on the backend.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 pt-2">
              Profile editing (name, avatar, etc.) will be wired to the backend
              once those endpoints are available. For now this page reflects the
              data returned from authentication.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
