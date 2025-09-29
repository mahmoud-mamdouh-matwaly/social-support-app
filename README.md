# Social Support Portal

A modern, AI-powered financial assistance application built with React.js and TypeScript. This Application allows users to apply for financial assistance through a guided multi-step process with intelligent writing assistance powered by OpenAI.

## 🚀 Live Demo

**[Try the Application Live →](https://mahmoud-mamdouh-matwaly.github.io/social-support-app/)**

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- **Git**

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd social-support-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Copy the example environment file:
```bash
cp env.example .env
```

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Verify Installation
```bash
# Run tests to ensure everything is working
npm test

# Check code quality
npm run lint
```

## 🤖 How to Set Up OpenAI API Key

The application includes AI-powered writing assistance that helps users write better descriptions. Here's how to set it up:

### Option 1: Use Without OpenAI (Recommended for Testing)
The application works perfectly without an OpenAI API key by providing realistic mock responses. Simply start the development server and the AI features will use mock data.

### Option 2: Set Up OpenAI API Key (For Production)

#### Step 1: Create OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up for an account or log in if you already have one
3. You'll need to add a payment method to use the API.

#### Step 2: Generate API Key
1. Navigate to [API Keys](https://platform.openai.com/account/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "Social Support App")
4. Copy the generated key immediately (you won't be able to see it again)

#### Step 3: Add API Key to Environment
Open your `.env` file and add your OpenAI API key:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here

```

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Check code quality
npm run type-check       # Check TypeScript types
```

## 📦 Building for Production

```bash
# Create production build
npm run build

# The built files will be in the 'dist' directory
# You can deploy these files to any static hosting service
```
