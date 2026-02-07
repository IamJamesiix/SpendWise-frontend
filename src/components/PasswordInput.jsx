import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({
  value,
  onChange,
  onKeyPress,
  placeholder = "••••••••",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};
