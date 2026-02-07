import React, { useState, useEffect } from "react";
import {
  Wallet,
  LogOut,
  Home,
  DollarSign,
  FileText,
  Brain,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { HomePage } from "./HomePage";
import { BudgetsPage } from "./BudgetsPage";
import { TaxesPage } from "./TaxesPage";
import { AIAssistantPage } from "./AIAssistantPage";
import { ChatPage } from "./ChatPage";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("homepage");
  const [budgets, setBudgets] = useState([]);

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

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    logout();
  };

  const navButton = (page, label, Icon) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        currentPage === page
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Smart Budget</span>
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
            {navButton("homepage", "Home", Home)}
            {navButton("budgets", "Budgets", DollarSign)}
            {navButton("taxes", "Tax Tracker", FileText)}
            {navButton("ai-assistant", "AI Assistant", Brain)}
            {navButton("messages", "Messages", MessageCircle)}
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
