import React, { useState } from "react";
import { Plus, X, Wallet, TrendingUp, AlertTriangle } from "lucide-react";
import { api } from "../services/api";

export const BudgetsPage = ({ budgets, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBudget, setNewBudget] = useState({ title: "", amount: "", purpose: "monthly" });

  const handleCreate = async () => {
    if (!newBudget.name || !newBudget.amount) return;
    setLoading(true);
    try {
      await api.setBudget(newBudget);
      setShowModal(false);
      setNewBudget({ name: "", amount: "", category: "" });
      onRefresh();
    } catch (err) {
      console.error("Failed to create budget");
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Budgets
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {budgets.length > 0
              ? `${budgets.length} budget${budgets.length !== 1 ? "s" : ""} totaling $${totalBudget.toLocaleString()}`
              : "Create budgets to track your spending"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm shrink-0 w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {/* Summary bar */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Total Budget</p>
            <p className="text-lg font-bold text-white">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="text-lg font-bold text-red-400">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Remaining</p>
            <p className="text-lg font-bold text-emerald-400">
              ${(totalBudget - totalSpent).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Budget cards */}
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget, idx) => {
            const pct = budget.amount
              ? Math.min(
                  Math.round(((budget.spent || 0) / budget.amount) * 100),
                  100
                )
              : 0;
            const isOver = pct >= 90;
            const isWarning = pct >= 70 && pct < 90;

            return (
              <div
                key={idx}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all duration-200 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">
                      {budget.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {budget.category || "Uncategorized"}
                    </p>
                  </div>
                  {isOver && (
                    <div className="bg-red-500/15 p-1.5 rounded-lg shrink-0 ml-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    </div>
                  )}
                </div>

                {/* Amounts */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      ${(budget.spent || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      of ${budget.amount?.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
                      isOver
                        ? "bg-red-500/15 text-red-400"
                        : isWarning
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ease-out ${
                      isOver
                        ? "bg-red-500"
                        : isWarning
                        ? "bg-amber-500"
                        : "bg-purple-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 mb-5">
            <Wallet className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No budgets yet
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Start tracking your spending by creating your first budget. Set
            limits for different categories.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Create First Budget
          </button>
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Create Budget
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Budget Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Groceries"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={newBudget.name}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    value={newBudget.amount}
                    onChange={(e) =>
                      setNewBudget({ ...newBudget, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food & Drinks"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !newBudget.name || !newBudget.amount}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                {loading ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
