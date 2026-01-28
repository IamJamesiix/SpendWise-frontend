# SpendWise Frontend

A modern, feature-rich finance management application built with React, featuring AI-powered financial assistance, budget tracking, and tax management.

## 🎨 Features

- **Authentication System**
  - Email/Password authentication with OTP verification
  - Google OAuth 2.0 integration
  - Password reset flow
  - Secure JWT-based sessions

- **Dashboard**
  - Budget management
  - Tax record tracking
  - AI-powered finance assistant
  - Real-time financial insights

- **UI/UX**
  - Dark/Light mode toggle
  - Responsive design for all devices
  - Beautiful gradient color scheme (Gold, Red, Purple)
  - Smooth animations and transitions
  - Professional, modern interface

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `https://localhost:3030/cny`

### Installation

1. **Clone and install dependencies:**
```bash
cd spendwise-frontend
npm install
```

2. **Configure environment variables:**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the API URL if needed
VITE_API_URL=https://localhost:3030/cny
VITE_FRONTEND_URL=http://localhost:3000
```

3. **Start the development server:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
spendwise-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/           # React contexts for state management
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── Dashboard.jsx
│   │   └── OAuthCallback.jsx
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles and theme variables
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Key Components

### Authentication Flow

1. **Signup** → User creates account
2. **Verify Email** → OTP sent to email
3. **Login** → Access dashboard
4. **OAuth** → Quick sign-in with Google

### Dashboard Features

- **Budget Management**: Set and track monthly budgets
- **Tax Records**: Add, view, and manage tax entries
- **AI Assistant**: Chat with AI for financial advice
- **Profile**: View and update user information

## 🎨 Design System

### Color Palette

- **Primary (Purple)**: `#8B5CF6`
- **Secondary (Red)**: `#FF3B5C`
- **Accent (Gold)**: `#FFB800`
- **Success**: `#10b981`
- **Error**: `#ef4444`

### Typography

- **Display Font**: Syne (headings, titles)
- **Body Font**: Inter (text, UI elements)

### Theme Modes

- **Dark Mode**: Dark backgrounds with high contrast
- **Light Mode**: Clean, bright interface

## 🔐 Security

- JWT tokens stored in localStorage
- HTTP-only cookies for session management
- Secure password requirements (min 6 characters)
- Email verification required
- Protected routes with authentication guards

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔗 API Integration

The frontend connects to the SpendWise backend API:

**Base URL**: `https://localhost:3030/cny`

**Key Endpoints**:
- `/auth/*` - Authentication
- `/budget/*` - Budget management
- `/tax/*` - Tax records
- `/chat/*` - AI assistant

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Environment Variables for Production

Update `.env` for your production environment:

```env
VITE_API_URL=https://your-api-domain.com/cny
VITE_FRONTEND_URL=https://your-frontend-domain.com
```

### Deploy Options

- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag & drop `dist` folder
- **Cloudflare Pages**: Connect repo or upload
- **Custom Server**: Serve `dist` folder with nginx/Apache

## 🐛 Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your backend's `FRONTEND_URL` environment variable matches your frontend URL.

### OAuth Redirect Issues

Make sure:
1. Backend `FRONTEND_URL` is set correctly
2. Google OAuth redirect URI includes `/oauth/callback`
3. Frontend and backend URLs match in environment variables

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Features Roadmap

- [ ] Expense tracking with categories
- [ ] Budget vs. actual spending charts
- [ ] Receipt scanning and OCR
- [ ] Multiple currency support
- [ ] Export data to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Recurring expense reminders
- [ ] Financial goal tracking

## 💡 Tips for Continuation

If you need to continue this conversation on another account or with another AI:

1. **Download these files** from the outputs directory
2. **Share the project structure** and key files
3. **Provide context**: "I have a React frontend for SpendWise API that needs [specific feature]"
4. **Include API documentation** from your backend

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ using React + Vite**