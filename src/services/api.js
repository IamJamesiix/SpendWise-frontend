const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3030/cny";

// ✅ Sends Bearer token for OAuth users (cross-domain cookie workaround)
const getAuthHeader = () => {
  const token = sessionStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
  checkSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      if (!response.ok) return { authenticated: false };
      return await response.json();
    } catch (error) {
      console.error("Session check error:", error);
      return { authenticated: false };
    }
  },

  signup: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Failed to connect to server" };
    }
  },

  verifyEmail: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Verify email error:", error);
      return { success: false, message: "Failed to verify email" };
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      console.error("Resend OTP error:", error);
      return { success: false, message: "Failed to resend OTP" };
    }
  },

  login: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Failed to connect to server" };
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      sessionStorage.removeItem("authToken");
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  deleteAccount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/deleteAccount`, {
        method: "DELETE",
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      sessionStorage.removeItem("authToken");
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/updateProfile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to update profile" };
    }
  },

  getBudget: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/getBudget`, {
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      return await response.json();
    } catch (error) {
      return { success: true, budgets: [] };
    }
  },

  setBudget: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/setBudget`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to create budget" };
    }
  },

  addExpense: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/addExpense`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to add expense" };
    }
  },

  chatWithAI: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to reach AI" };
    }
  },

  getContacts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/contacts`, {
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      return await response.json();
    } catch (error) {
      return { success: true, contacts: [] };
    }
  },

  getMessagesByUserId: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      return await response.json();
    } catch (error) {
      return { success: true, messages: [] };
    }
  },

  sendMessage: async (userId, message, image = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify({
          text: message || "",
          ...(image && { image }),
        }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to send message" };
    }
  },

  getChatHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  addTax: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/addTax`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to add tax" };
    }
  },

  getTaxes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/getTaxes`, {
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      return await response.json();
    } catch (error) {
      return { success: true, taxes: [] };
    }
  },

  updateTax: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/updateTax/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to update tax" };
    }
  },

  deleteTax: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/deleteTax/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { ...getAuthHeader() },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to delete tax" };
    }
  },
};

export { api, API_BASE_URL };