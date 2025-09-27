# Social Support App

A modern React.js application built with TypeScript, providing emotional support and guidance through an intuitive chat interface.

## 🚀 Tech Stack

- **Framework**: React.js 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **API Calls**: Axios
- **Internationalization**: React-i18next
- **AI Integration**: OpenAI SDK
- **Testing**: Jest & Testing Library

## 📁 Project Structure

```
social-support-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services and utilities
│   ├── store/             # Redux store and slices
│   │   └── slices/        # Redux slices
│   ├── i18n/              # Internationalization
│   │   └── locales/       # Translation files
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── assets/            # Images, icons, etc.
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-support-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🌍 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_ORGANIZATION=your_openai_organization_id_here

# App Configuration
VITE_APP_NAME=Social Support App
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## 🎨 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Multi-language Support**: English, Spanish, and French
- **Real-time Chat**: Interactive chat interface
- **State Management**: Centralized state with Redux Toolkit
- **Type Safety**: Full TypeScript support
- **Modern UI**: Clean and accessible components
- **API Integration**: Ready for backend integration
- **Testing Ready**: Jest and Testing Library configured

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### TypeScript
TypeScript configuration is in `tsconfig.json` with strict mode enabled.

### Vite
Build tool configuration is in `vite.config.ts` with React plugin and path aliases.

### ESLint
Linting rules are configured in `.eslintrc.cjs`.

## 🌐 Internationalization

The app supports multiple languages using react-i18next:

- **English** (default)
- **ARABIC**

Translation files are located in `src/i18n/locales/`.

## 🧪 Testing

The project is configured with Jest and Testing Library for unit and integration testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- OpenAI for AI capabilities
- All contributors and maintainers

---

**Happy coding!** 🎉
