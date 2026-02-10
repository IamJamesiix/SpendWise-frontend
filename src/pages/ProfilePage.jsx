import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    budgetsCount: 0,
    taxesCount: 0,
    totalBudget: 0,
    totalTax: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [budgetsRes, taxesRes] = await Promise.all([
          api.getBudget(),
          api.getTaxes(),
        ]);

        const budgetsList = budgetsRes?.budgets || [];
        const taxesList = Array.isArray(taxesRes)
          ? taxesRes
          : taxesRes?.taxes || [];

        setStats({
          budgetsCount: budgetsList.length,
          taxesCount: taxesList.length,
          totalBudget: budgetsList.reduce((s, b) => s + (b.amount || 0), 0),
          totalTax: taxesList.reduce(
            (s, t) => s + (Number(t.amount) || 0),
            0
          ),
        });
      } catch {
        setStats({ budgetsCount: 0, taxesCount: 0, totalBudget: 0, totalTax: 0 });
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    logout();
  };

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
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your account information at a glance
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-12 w-32 h-32 bg-white/5 rounded-full translate-y-1/3" />
        </div>

        {/* Avatar + info */}
        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-4 border-gray-900 shrink-0 shadow-xl">
              {initials}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                {fullName}
              </h2>
              <p className="text-sm text-gray-400 truncate">
                {user?.userName ? `@${user.userName}` : "SpendWise Member"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info + Stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Account details */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-white mb-4">
            Account Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/15 p-2 rounded-lg shrink-0">
                <User className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm text-white truncate">{fullName}</p>
              </div>
            </div>

            <div className="h-px bg-gray-800" />

            <div className="flex items-center gap-3">
              <div className="bg-purple-500/15 p-2 rounded-lg shrink-0">
                <Mail className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-white truncate">
                  {user?.email || "Not set"}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-800" />

            <div className="flex items-center gap-3">
              <div className="bg-purple-500/15 p-2 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm text-emerald-400">Active Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 content-start">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-500/15 p-2 rounded-xl">
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Budget Plans</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {loadingStats ? "..." : stats.budgetsCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">active budgets</p>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-pink-500/15 p-2 rounded-xl">
                <FileText className="w-4 h-4 text-pink-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Tax Records</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {loadingStats ? "..." : stats.taxesCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">saved entries</p>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-500/15 p-2 rounded-xl">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Budgeted</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {loadingStats
                ? "..."
                : `$${stats.totalBudget.toLocaleString()}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">across all budgets</p>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-amber-500/15 p-2 rounded-xl">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Tax</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-400">
              {loadingStats ? "..." : `$${stats.totalTax.toLocaleString()}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">recorded amount</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Sign Out</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Log out of your SpendWise account on this device.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 rounded-xl transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};
