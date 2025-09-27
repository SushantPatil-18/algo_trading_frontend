# AlgoTrading Frontend

A modern React frontend for the AlgoTrading Bot backend, built with Vite and Tailwind CSS.

## Features

### 🔐 Authentication System
- User registration and login
- JWT token-based authentication
- Protected routes and auto-logout
- User profile management

### 📊 Dashboard
- Real-time bot statistics
- Trading performance metrics
- Today's trading summary
- Recent bots overview
- P&L tracking with visual indicators

### 🤖 Bot Management
- Create, start, stop, pause, and resume trading bots
- Multiple trading strategies support:
  - Simple Moving Average (SMA) Crossover
  - RSI Mean Reversion
  - Grid Trading
  - Dollar Cost Averaging (DCA)
- Real-time bot status monitoring
- Performance analytics and trade history
- Detailed bot configuration and settings

### 🏦 Exchange Management
- Add and manage exchange accounts (Binance, Delta Exchange)
- Secure API key storage with encryption
- Connection testing and validation
- Testnet/sandbox support
- Account permissions management

### ⚙️ Strategy Configuration
- Dynamic parameter forms for each strategy
- Real-time validation
- Risk level indicators
- Minimum balance requirements
- Strategy testing capabilities

### 🔔 Settings & Notifications
- Email notification preferences
- Account information management
- Test email functionality
- Security settings

## Tech Stack

- **React 19** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **Recharts** - Charting library (ready for analytics)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Modal, etc.)
│   ├── Header.jsx       # App header with user menu
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Layout.jsx       # Main layout wrapper
│   └── ProtectedRoute.jsx # Route protection
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state management
├── pages/               # Page components
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Bots.jsx         # Bot listing and management
│   ├── BotDetails.jsx   # Individual bot details
│   ├── CreateBot.jsx    # Bot creation wizard
│   ├── Exchanges.jsx    # Exchange account management
│   └── Settings.jsx     # User settings
├── services/            # API services
│   └── api.js           # Axios configuration and API calls
├── App.jsx              # Root component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## Key Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Sidebar navigation with mobile support

### Real-time Updates
- Bot status monitoring
- Performance metrics
- Trade notifications
- Connection status

### Security
- JWT token management
- Automatic token refresh
- Secure API key handling
- Protected routes

### User Experience
- Loading states for all async operations
- Toast notifications for user feedback
- Form validation and error handling
- Intuitive navigation and workflows

## API Integration

The frontend integrates with the backend through RESTful APIs:

- **Auth API**: Login, register, profile management
- **Dashboard API**: Statistics and analytics
- **Strategies API**: Bot creation and strategy management
- **Bots API**: Bot control (start/stop/pause/resume)
- **Exchange API**: Exchange account management
- **Settings API**: User preferences and notifications

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Environment Setup

Make sure your backend is running on `http://localhost:5000` or update the API base URL in `src/services/api.js`.

## Contributing

The codebase follows React best practices:
- Functional components with hooks
- Context API for state management
- Custom hooks for reusable logic
- Component composition patterns
- Proper error handling and loading states+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
