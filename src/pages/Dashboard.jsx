import React, { useState, useEffect } from "react";
import {
  Wallet,
  LogOut,
  Home,
  DollarSign,
  FileText,
  Brain,
  MessageCircle,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { HomePage } from "./HomePage";
import { BudgetsPage } from "./BudgetsPage";
import { TaxesPage } from "./TaxesPage";
import { AIAssistantPage } from "./AIAssistantPage";
import { ChatPage } from "./ChatPage";
import { ProfilePage } from "./ProfilePage";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("homepage");
  const [budgets, setBudgets] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadBudgets = async () => {
    try {
      const result = await api.getBudget();
      if (result.success) setBudgets(result.budgets || []);
    } catch (err) {
      console.error("Failed to load budgets");
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      const result = await api.logout();
      if (result?.error) {
        toast.error(result.error || "Failed to log out");
      } else {
        toast.success("Logged out");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out");
    } finally {
      logout();
      setLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate("/", { replace: true });
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: "homepage", label: "Home", icon: Home },
    { id: "budgets", label: "Budgets", icon: DollarSign },
    { id: "taxes", label: "Tax Tracker", icon: FileText },
    { id: "ai-assistant", label: "AI Assistant", icon: Brain },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
  ];

  const getInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getPageTitle = () => {
    const item = navItems.find((n) => n.id === currentPage);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-purple-500/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              SpendWise
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-purple-500/15 text-purple-400 shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-purple-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName || "User"} {user?.lastName || ""}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@email.com"}
              </p>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-400 mr-2">
                Hi, {user?.firstName || "User"}!
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold lg:hidden">
                {getInitials()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentPage === "homepage" && <HomePage budgets={budgets} />}
            {currentPage === "budgets" && (
              <BudgetsPage budgets={budgets} onRefresh={loadBudgets} />
            )}
            {currentPage === "taxes" && <TaxesPage />}
            {currentPage === "ai-assistant" && <AIAssistantPage />}
            {currentPage === "messages" && <ChatPage />}
            {currentPage === "profile" && <ProfilePage />}
          </div>
        </main>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-sm">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Log out</h2>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-300">
                Are you sure you want to log out of your SpendWise account?
              </p>
              <p className="text-xs text-gray-500">
                You'll need to sign in again to access your dashboard and
                financial data.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={loggingOut}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
