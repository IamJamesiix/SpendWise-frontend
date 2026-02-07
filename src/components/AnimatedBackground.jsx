import React from "react";
import { Wallet, TrendingUp, Brain, Gift } from "lucide-react";

export const AnimatedBackground = () => (
  <div className="relative w-full h-full bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 overflow-hidden">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
    </div>
    <div className="relative h-full flex flex-col items-center justify-center text-white px-8">
      <div className="mb-8">
        <Wallet className="w-20 h-20 mb-4 text-yellow-400" />
      </div>
      <h1 className="text-5xl font-bold mb-4 text-center">Smart Budget</h1>
      <p className="text-xl text-center mb-16 max-w-md">
        AI-powered financial planning for smarter decisions
      </p>
      <div className="space-y-8">
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Track Expenses</h3>
            <p className="text-sm text-white/80">Monitor spending in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <div className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <p className="text-sm text-white/80">Get personalized advice</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-xl">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Plan Gifts</h3>
            <p className="text-sm text-white/80">Budget for special occasions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
