const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3030/cny";

const api = {
  checkSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to logout" };
    }
  },

  getBudget: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/budget/getBudget`, {
        credentials: "include",
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to create budget" };
    }
  },

  chatWithAI: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: true,
        response: "Sorry, I encountered an error. Please try again.",
      };
    }
  },

  getContacts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/contacts`, {
        credentials: "include",
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
      });
      return await response.json();
    } catch (error) {
      return { success: true, messages: [] };
    }
  },

  sendMessage: async (userId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to send message" };
    }
  },

  addTax: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/addTax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      });
      return await response.json();
    } catch (error) {
      return { success: true, taxes: [] };
    }
  },

  deleteTax: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tax/deleteTax/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Failed to delete tax" };
    }
  },
};

export { api, API_BASE_URL };
