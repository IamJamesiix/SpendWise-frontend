import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:3030/cny';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('spendwise_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('spendwise_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    return data;
  },
  
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
  
  verifyEmail: async (email, otp) => {
    const { data } = await api.post('/auth/verify-email', { email, otp });
    return data;
  },
  
  resendVerification: async (email) => {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  },
  
  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  
  verifyResetOTP: async (email, otp) => {
    const { data } = await api.post('/auth/verify-reset-otp', { email, otp });
    return data;
  },
  
  resetPassword: async (resetToken, newPassword) => {
    const { data } = await api.post('/auth/reset-password', { resetToken, newPassword });
    return data;
  },
  
  deleteAccount: async () => {
    const { data } = await api.delete('/auth/delete-account');
    return data;
  },
  
  updateProfile: async (profilePic) => {
    const { data } = await api.put('/auth/updateProfile', { profilePic });
    return data;
  },
  
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/oauth/login`;
  }
};

// Budget Services
export const budgetService = {
  setBudget: async (amount, currency = 'NGN') => {
    const { data } = await api.post('/budget/setBudget', { amount, currency });
    return data;
  },
  
  getBudget: async () => {
    const { data } = await api.get('/budget/getBudget');
    return data;
  }
};

// Tax Services
export const taxService = {
  addTax: async (taxData) => {
    const { data } = await api.post('/tax/addTax', taxData);
    return data;
  },
  
  getTaxes: async () => {
    const { data } = await api.get('/tax/getTaxes');
    return data;
  },
  
  updateTax: async (id, taxData) => {
    const { data } = await api.put(`/tax/updateTax/${id}`, taxData);
    return data;
  },
  
  deleteTax: async (id) => {
    const { data } = await api.delete(`/tax/deleteTax/${id}`);
    return data;
  }
};

// Chat Services
export const chatService = {
  sendMessage: async (message) => {
    const { data } = await api.post('/chat/ai', { message });
    return data;
  },
  
  getContacts: async () => {
    const { data } = await api.get('/chat/contacts');
    return data;
  },
  
  getPartners: async () => {
    const { data } = await api.get('/chat/partners');
    return data;
  },
  
  getChatMessages: async (userId) => {
    const { data } = await api.get(`/chat/${userId}`);
    return data;
  },
  
  sendChatMessage: async (userId, message) => {
    const { data } = await api.post(`/chat/${userId}`, { message });
    return data;
  },
  
  deleteMessage: async (messageId) => {
    const { data } = await api.delete(`/chat/${messageId}`);
    return data;
  },
  
  deleteChat: async (userId) => {
    const { data } = await api.delete(`/chat/chat/${userId}`);
    return data;
  }
};

export default api;