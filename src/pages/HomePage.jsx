import React from "react";
import {
  Wallet, TrendingUp, TrendingDown, PieChart,
  ArrowDownRight, Target, Sparkles, DollarSign, BarChart3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const CURRENCY_SYMBOLS = { NGN: "₦", USD: "$", EUR: "€", GBP: "£" };
const getSymbol = (currency) => CURRENCY_SYMBOLS[currency] || "₦";

// ✅ Format large numbers compactly to avoid overflow
const formatAmount = (val) => {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toLocaleString();
};

// ✅ When budgets have mixed currencies, show "Mixed" instead of adding wrong numbers
const getSummarySymbol = (budgets) => {
  const currencies = [...new Set(budgets.map((b) => b.currency || "NGN"))];
  if (currencies.length === 1) return getSymbol(currencies[0]);
  return "~₦"; // mixed — approximate in NGN
};

export const HomePage = ({ budgets }) => {
  const { user } = useAuth();
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const savingsRate = totalBudget > 0 ? Math.round((1 - totalSpent / totalBudget) * 100) : 0;
  const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const symbol = getSummarySymbol(budgets);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      label: "Total Budget",
      value: `${symbol}${formatAmount(totalBudget)}`,
      icon: Wallet,
      bgFrom: "from-purple-500/10", bgTo: "to-purple-600/5",
      borderColor: "border-purple-500/20", iconBg: "bg-purple-500/15",
      iconColor: "text-purple-400", valueColor: "text-purple-400",
    },
    {
      label: "Total Spent",
      value: `${symbol}${formatAmount(totalSpent)}`,
      icon: TrendingDown,
      bgFrom: "from-red-500/10", bgTo: "to-red-600/5",
      borderColor: "border-red-500/20", iconBg: "bg-red-500/15",
      iconColor: "text-red-400", valueColor: "text-red-400",
    },
    {
      label: "Remaining",
      value: `${symbol}${formatAmount(remaining)}`,
      icon: DollarSign,
      bgFrom: "from-emerald-500/10", bgTo: "to-emerald-600/5",
      borderColor: "border-emerald-500/20", iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400", valueColor: "text-emerald-400",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      icon: Target,
      bgFrom: "from-amber-500/10", bgTo: "to-amber-600/5",
      borderColor: "border-amber-500/20", iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400", valueColor: "text-amber-400",
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
            {getGreeting()}, {user?.fullName?.split(" ")?.[0] || user?.userName || "User"}!
          </h1>
          <p className="text-purple-200 text-sm sm:text-base max-w-lg">
            {budgets.length > 0
              ? `You have ${budgets.length} active budget${budgets.length !== 1 ? "s" : ""}. You've spent ${spentPercentage}% of your total budget this period.`
              : "Start by creating your first budget to track your spending."}
          </p>
        </div>
      </div>

      {/* ✅ Stat cards — compact value display prevents overflow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.bgFrom} ${card.bgTo} rounded-2xl border ${card.borderColor} p-4 sm:p-5 transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.iconBg} p-2 rounded-xl`}>
                <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-1 truncate">{card.label}</p>
            {/* ✅ truncate + responsive text size prevents overflow */}
            <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${card.valueColor} truncate`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Budget overview + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Budget Breakdown</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>{budgets.length} budgets</span>
            </div>
          </div>

          {budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.slice(0, 5).map((budget, idx) => {
                const budgetSymbol = getSymbol(budget.currency);
                const pct = budget.amount
                  ? Math.min(Math.round(((budget.spent || 0) / budget.amount) * 100), 100)
                  : 0;
                const isOver = pct >= 90;
                const isWarning = pct >= 70 && pct < 90;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          isOver ? "bg-red-400" : isWarning ? "bg-amber-400" : "bg-emerald-400"
                        }`} />
                        {/* ✅ Fixed — was budget.name, now budget.title */}
                        <span className="text-sm text-white font-medium truncate">{budget.title}</span>
                        <span className="text-xs text-gray-500 hidden sm:block shrink-0">{budget.purpose}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs shrink-0">
                        <span className="text-gray-400">{budgetSymbol}{formatAmount(budget.spent || 0)}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-white font-medium">{budgetSymbol}{formatAmount(budget.amount)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isOver ? "bg-gradient-to-r from-red-500 to-red-400"
                          : isWarning ? "bg-gradient-to-r from-amber-500 to-amber-400"
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
              <p className="text-gray-600 text-xs">Create your first budget to see spending data here.</p>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Stats</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/15 p-2 rounded-lg shrink-0">
                  <PieChart className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm text-gray-400">Active Budgets</span>
              </div>
              <span className="text-xl font-bold text-white">{budgets.length}</span>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/15 p-2 rounded-lg shrink-0">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-400">Savings Rate</span>
              </div>
              <span className={`text-xl font-bold ${savingsRate >= 50 ? "text-emerald-400" : savingsRate >= 20 ? "text-amber-400" : "text-red-400"}`}>
                {savingsRate}%
              </span>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/15 p-2 rounded-lg shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm text-gray-400">Spent Ratio</span>
              </div>
              <span className="text-xl font-bold text-white">{spentPercentage}%</span>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/15 p-2 rounded-lg shrink-0">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-sm text-gray-400">Avg per Budget</span>
              </div>
              {/* ✅ Uses correct symbol */}
              <span className="text-xl font-bold text-white">
                {symbol}{budgets.length > 0 ? formatAmount(Math.round(totalBudget / budgets.length)) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};