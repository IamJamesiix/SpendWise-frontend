import React, { useEffect, useState, useRef } from "react";
import {
  User, Mail, Calendar, DollarSign, FileText,
  LogOut, Camera, Trash2, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const CURRENCY_SYMBOLS = { NGN: "₦", USD: "$", EUR: "€", GBP: "£" };
const getSymbol = (currency) => CURRENCY_SYMBOLS[currency] || "₦";

// Format total budgeted — if mixed currencies, group by currency
const formatTotalBudget = (budgets) => {
  if (budgets.length === 0) return "₦0";
  const currencies = [...new Set(budgets.map((b) => b.currency || "NGN"))];
  if (currencies.length === 1) {
    const sym = getSymbol(currencies[0]);
    const total = budgets.reduce((s, b) => s + (b.amount || 0), 0);
    return `${sym}${total.toLocaleString()}`;
  }
  // Mixed — show each currency separately
  return currencies.map((c) => {
    const sym = getSymbol(c);
    const total = budgets.filter((b) => (b.currency || "NGN") === c).reduce((s, b) => s + (b.amount || 0), 0);
    return `${sym}${total.toLocaleString()}`;
  }).join(" + ");
};

export const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [stats, setStats] = useState({
    budgetsCount: 0, taxesCount: 0, budgetsList: [], totalTax: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [budgetsRes, taxesRes] = await Promise.all([
          api.getBudget(),
          api.getTaxes(),
        ]);
        const budgetsList = budgetsRes?.budgets || [];
        const taxesList = Array.isArray(taxesRes) ? taxesRes : taxesRes?.taxes || [];
        setStats({
          budgetsCount: budgetsList.length,
          taxesCount: taxesList.length,
          budgetsList,
          totalTax: taxesList.reduce((s, t) => s + (Number(t.amount) || 0), 0),
        });
      } catch {
        setStats({ budgetsCount: 0, taxesCount: 0, budgetsList: [], totalTax: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    logout();
    navigate("/", { replace: true });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5MB");

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const result = await api.updateProfile({ profilePic: reader.result });
        if (result?.profilePic && setUser) {
          setUser((prev) => ({ ...prev, profilePic: result.profilePic }));
        }
      } catch (err) {
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteAccount();
      queryClient.clear();
      logout();
      navigate("/", { replace: true });
    } catch {
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const initials = (() => {
    const name = user?.fullName || user?.userName || "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  })();

  const fullName = user?.fullName || user?.userName || "Anonymous User";

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Your account information at a glance</p>
      </div>

      {/* Profile card */}
      <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
        <div className="relative z-0 h-32 sm:h-44 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        </div>
        <div className="px-5 sm:px-8 pb-6 pt-4">
          <div className="flex items-center gap-4 sm:gap-5 relative">
            <div className="relative z-10 -mt-12 sm:-mt-14 shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-4 border-gray-900 shadow-xl shadow-purple-500/20">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{fullName}</h2>
              <p className="text-sm text-gray-400 truncate">
                {user?.userName ? `@${user.userName}` : "SpendWise Member"}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                {uploading ? "Uploading..." : "Change photo"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info + Stats grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Account Details</h3>
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
                <p className="text-sm text-white truncate">{user?.email || "Not set"}</p>
              </div>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/15 p-2 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm text-emerald-400">
                  {user?.isEmailVerified ? "Verified Member" : "Active Member"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4 content-start">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="bg-purple-500/15 p-2 rounded-xl w-fit mb-3">
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Budget Plans</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loadingStats ? "..." : stats.budgetsCount}</p>
            <p className="text-xs text-gray-500 mt-1">active budgets</p>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="bg-pink-500/15 p-2 rounded-xl w-fit mb-3">
              <FileText className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Tax Records</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{loadingStats ? "..." : stats.taxesCount}</p>
            <p className="text-xs text-gray-500 mt-1">saved entries</p>
          </div>

          {/* ✅ Fixed — shows correct currency per budget, handles mixed currencies */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="bg-emerald-500/15 p-2 rounded-xl w-fit mb-3">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Budgeted</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-400 break-all leading-tight">
              {loadingStats ? "..." : formatTotalBudget(stats.budgetsList)}
            </p>
            <p className="text-xs text-gray-500 mt-1">across all budgets</p>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className="bg-amber-500/15 p-2 rounded-xl w-fit mb-3">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Tax</p>
            <p className="text-lg sm:text-xl font-bold text-amber-400">
              {loadingStats ? "..." : `₦${stats.totalTax.toLocaleString()}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">recorded amount</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Sign Out</h3>
          <p className="text-xs text-gray-500 mt-0.5">Log out of your SpendWise account on this device.</p>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-500/20 rounded-xl transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-gray-900 rounded-2xl border border-red-500/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
          <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all associated data.</p>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500 rounded-xl transition-all w-fit"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Log out of SpendWise?</h3>
            <p className="text-xs text-gray-400 mb-5">You'll need to sign in again to access your dashboard.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                onClick={async () => { setShowLogoutModal(false); await handleLogout(); }}
                className="px-4 py-2 text-sm font-medium text-red-100 bg-red-600 hover:bg-red-500 rounded-xl flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Delete Account</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-300 mb-3">This will permanently delete:</p>
              <ul className="text-xs text-gray-500 space-y-1 mb-4 pl-2">
                <li>• Your account and profile</li>
                <li>• All your budgets and expenses</li>
                <li>• All your tax records</li>
                <li>• All your chat history</li>
              </ul>
              <p className="text-xs text-red-400 font-medium">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} disabled={deleting} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 rounded-xl transition-colors">
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};