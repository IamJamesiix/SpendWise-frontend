import React from "react";
import { Wallet, TrendingUp, PieChart } from "lucide-react";

export const HomePage = ({ budgets }) => {
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/80 text-sm">Total Budget</h3>
            <Wallet className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-4xl font-bold text-white">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-2xl border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/80 text-sm">Total Spent</h3>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-4xl font-bold text-white">
            ${totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-2xl border border-yellow-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/80 text-sm">Remaining</h3>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-4xl font-bold text-white">
            ${(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Active Budgets</p>
            <p className="text-3xl font-bold text-white">{budgets.length}</p>
          </div>
          <div className="text-center p-4 bg-gray-900/50 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Savings Rate</p>
            <p className="text-3xl font-bold text-white">
              {totalBudget > 0
                ? Math.round((1 - totalSpent / totalBudget) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
