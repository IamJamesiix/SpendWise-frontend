import React from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Sparkles,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const HomePage = ({ budgets }) => {
  const { user } = useAuth();
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const savingsRate =
    totalBudget > 0 ? Math.round((1 - totalSpent / totalBudget) * 100) : 0;
  const spentPercentage =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      label: "Total Budget",
      value: totalBudget,
      icon: Wallet,
      color: "purple",
      bgFrom: "from-purple-500/10",
      bgTo: "to-purple-600/5",
      borderColor: "border-purple-500/20",
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-400",
      valueColor: "text-purple-400",
    },
    {
      label: "Total Spent",
      value: totalSpent,
      icon: TrendingDown,
      color: "red",
      bgFrom: "from-red-500/10",
      bgTo: "to-red-600/5",
      borderColor: "border-red-500/20",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
    {
      label: "Remaining",
      value: remaining,
      icon: DollarSign,
      color: "emerald",
      bgFrom: "from-emerald-500/10",
      bgTo: "to-emerald-600/5",
      borderColor: "border-emerald-500/20",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      label: "Savings Rate",
      value: savingsRate,
      icon: Target,
      isSavings: true,
      color: "amber",
      bgFrom: "from-amber-500/10",
      bgTo: "to-amber-600/5",
      borderColor: "border-amber-500/20",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 text-purple-200 text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {getGreeting()}, {user?.firstName || "User"}!
          </h1>
          <p className="text-purple-200 text-sm sm:text-base max-w-lg">
            {budgets.length > 0
              ? `You have ${budgets.length} active budget${budgets.length !== 1 ? "s" : ""}. You've spent ${spentPercentage}% of your total budget this period.`
              : "Start by creating your first budget to track your spending."}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.bgFrom} ${card.bgTo} rounded-2xl border ${card.borderColor} p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`${card.iconBg} p-2 rounded-xl`}
              >
                <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-1">{card.label}</p>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${card.valueColor}`}>
              {card.isSavings ? `${card.value}%` : `$${card.value.toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      {/* Budget overview + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Spending progress */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Budget Breakdown
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>{budgets.length} budgets</span>
            </div>
          </div>

          {budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.slice(0, 5).map((budget, idx) => {
                const pct = budget.amount
                  ? Math.min(
                      Math.round(((budget.spent || 0) / budget.amount) * 100),
                      100
                    )
                  : 0;
                const isOver = pct >= 90;
                const isWarning = pct >= 70 && pct < 90;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isOver
                              ? "bg-red-400"
                              : isWarning
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <span className="text-sm text-white font-medium">
                          {budget.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {budget.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-400">
                          ${(budget.spent || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-600">/</span>
                        <span className="text-white font-medium">
                          ${budget.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isOver
                            ? "bg-gradient-to-r from-red-500 to-red-400"
                            : isWarning
                            ? "bg-gradient-to-r from-amber-500 to-amber-400"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-800 p-4 rounded-2xl mb-4">
                <Wallet className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm mb-1">No budgets yet</p>
              <p className="text-gray-600 text-xs">
                Create your first budget to see spending data here.
              </p>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Stats</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/15 p-2 rounded-lg">
                  <PieChart className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm text-gray-400">Active Budgets</span>
              </div>
              <span className="text-xl font-bold text-white">
                {budgets.length}
              </span>
            </div>

            <div className="h-px bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/15 p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-400">Savings Rate</span>
              </div>
              <span
                className={`text-xl font-bold ${
                  savingsRate >= 50
                    ? "text-emerald-400"
                    : savingsRate >= 20
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {savingsRate}%
              </span>
            </div>

            <div className="h-px bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/15 p-2 rounded-lg">
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm text-gray-400">Spent Ratio</span>
              </div>
              <span className="text-xl font-bold text-white">
                {spentPercentage}%
              </span>
            </div>

            <div className="h-px bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/15 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-sm text-gray-400">Avg per Budget</span>
              </div>
              <span className="text-xl font-bold text-white">
                $
                {budgets.length > 0
                  ? Math.round(totalBudget / budgets.length).toLocaleString()
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
