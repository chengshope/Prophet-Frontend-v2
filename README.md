# Prophet Frontend v2

**Modern Revenue Management for Self-Storage**

Prophet is an AI-driven revenue management platform that provides automated street rate and existing customer rate increase (ECRI) recommendations for self-storage facilities. Built with modern web technologies, this application helps storage operators make intelligent pricing decisions and stay competitive in the market.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Ant Design 5** - UI component library
- **Redux Toolkit** - State management
- **React Router v7** - Routing
- **Chart.js** - Data visualization
- **Google Maps API** - Location services
- **Day.js** - Date manipulation

## 📋 Prerequisites

- Node.js (v22 or higher recommended)
- Yarn 4.9.4 (specified in package.json)
- Google Maps API key

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Prophet-Frontend-v2
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   VITE_BACKEND_HOST=http://localhost:3000
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

## 🏃 Running the Application

### Development Mode

```bash
yarn dev
```

The application will be available at `http://localhost:5432`

### Production Build

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## 🧹 Code Quality

### Linting

```bash
# Check for linting errors
yarn lint

# Auto-fix linting errors
yarn lint:fix
```

### Formatting

```bash
# Format code with Prettier
yarn format

# Check formatting without making changes
yarn format:check
```

## 📁 Project Structure

```
src/
├── api/              # API service layer (RTK Query)
├── assets/           # Static assets (images, logos)
├── components/       # Reusable components
│   ├── common/       # Common UI components
│   └── widgets/      # Feature-specific widgets
├── constants/        # Application constants
├── contexts/         # React contexts
├── features/         # Feature-based Redux slices
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
│   ├── AuthLayout/   # Authentication pages layout
│   └── MainLayout/   # Main application layout
├── pages/            # Page components
│   ├── Competitors/
│   ├── ExistingCustomers/
│   ├── ForgotPassword/
│   ├── Login/
│   ├── Portfolio/
│   ├── Reporting/
│   ├── ResetPassword/
│   ├── Settings/
│   └── StreetRates/
├── providers/        # Context providers
├── router/           # Routing configuration
├── store/            # Redux store configuration
├── styles/           # Global styles and themes
└── utils/            # Utility functions
```

## 🔑 Key Features

### 🤖 AI-Driven Revenue Management

- **Daily Street Rate Recommendations** - Automated analysis of market and competitive intelligence
- **ECRI Move-Out Probability** - Calculated move-out probabilities for individual tenants during rate increases
- **Insights Dashboard** - Track revenue impact, customer response, and pricing performance in real-time
- **Algorithm-Driven Pricing** - Smart pricing recommendations with a click of a button

### 🏢 Portfolio Management

- View and manage multiple portfolios
- User management per portfolio
- Facility management across properties
- Portfolio-level controls for pricing strategies

### 🎯 Competitor Intelligence

- **Automated Competitor Rate Monitoring** - Automatically pulls in competitor pricing to keep you market-aware
- Track competitor facilities and occupancy
- Geographic visualization with Google Maps
- Compare rates across the market

### 💰 Street Rates & ECRI

- Monitor market rates in real-time
- Automated rate analysis (eliminates manual spreadsheets)
- Historical rate tracking
- Predictive insights into customer retention risk before rate increases

### 📊 Reporting & Analytics

- Revenue impact tracking
- Customer response analytics
- Data visualization with interactive charts
- Export capabilities (CSV)
- Performance metrics and KPIs

### 🔐 Authentication & Security

- Secure login with email/password
- Forgot password flow
- Reset password with Terms of Service acceptance
- Protected routes with authentication guards

### ⚙️ Settings

- User preferences
- Application configuration
- Theme customization

## 🎨 Styling

The application uses:

- **Ant Design** for component styling
- **LESS** for custom styles
- Custom theme configuration in `src/styles/antd-theme.js`
- Global styles in `src/styles/global.less`

## 🔐 State Management

- **Redux Toolkit** for global state
- **RTK Query** for API calls and caching
- Feature-based slice organization

## 🌐 API Integration

API services are organized in `src/api/`:

- `authApi.js` - Authentication endpoints
- `portfolioApi.js` - Portfolio management
- `competitorsApi.js` - Competitor data
- `facilitiesApi.js` - Facility management
- `streetRatesApi.js` - Street rate data
- `reportingApi.js` - Analytics and reporting
- `settingsApi.js` - User settings

## 📝 Code Style

The project follows:

- ESLint configuration with React best practices
- Prettier for consistent formatting
- Single quotes, semicolons always
- ES5 trailing commas

## 🤝 Contributing

1. Follow the existing code style
2. Run linting and formatting before committing
3. Write meaningful commit messages
4. Test your changes thoroughly

## 📄 License

Copyright © 2025 Sparebox Technologies

## 🌟 About SpareBox Technologies

SpareBox Technologies provides technological solutions designed to optimize the management and operation of self-storage facilities. Our suite includes:

- **RaFA** - Revenue and Facility Analytics
- **BigFoot** - Operational management tools
- **Prophet** - AI-driven revenue management (this application)

## 🔗 Related Links

### Prophet Application

- **Production**: [prophet.spareboxtech.com](https://prophet.spareboxtech.com)
- **Staging**: [staging-prophet.spareboxtech.com](https://staging-prophet.spareboxtech.com)
- **Product Introduction**: [https://spareboxtech.com/prophet/](https://spareboxtech.com/prophet/)

### SpareBox Technologies

- [SpareBox Technologies](https://spareboxtech.com/)
- [Terms of Service](https://spareboxtech.com/terms-of-service-bigfoot-prophet/)

### Documentation

- [Ant Design Documentation](https://ant.design/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
