import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { api } from "../services/api";

export const BudgetsPage = ({ budgets, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const handleCreate = async () => {
    try {
      await api.setBudget(newBudget);
      setShowModal(false);
      setNewBudget({ name: "", amount: "", category: "" });
      onRefresh();
    } catch (err) {
      console.error("Failed to create budget");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">My Budgets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, idx) => (
          <div
            key={idx}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">{budget.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{budget.category}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Budget</span>
                <span className="text-white font-bold">${budget.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Spent</span>
                <span className="text-red-400 font-bold">
                  ${budget.spent || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((budget.spent || 0) / budget.amount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl border border-purple-500/30 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">New Budget</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Budget Name</label>
                <input
                  type="text"
                  placeholder="e.g., Groceries"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newBudget.name}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="500"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Food"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl"
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
