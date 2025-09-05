# Modern Chat Application with Agent Selection

A modern, responsive chat application built with Next.js, TypeScript, Tailwind CSS, and NextAuth.js. This template provides a secure authentication system, clean UI for chat interactions, OpenAI API integration with multiple agent types, and robust error handling.

## 🌟 Features

- 🔒 **Enterprise-Grade Authentication**
  - Password-based admin login
  - GitHub OAuth integration
  - JWT-based session management
  - CSRF protection
- 💬 **Advanced Chat Interface**
  - Responsive design that works on all devices
  - Real-time typing indicators
  - Auto-scrolling chat window
  - Smooth animations and transitions
  - Multiple agent selection (General, Code, Creative, Academic)
- 🤖 **AI Integration**
  - OpenAI API integration for intelligent responses
  - Multiple specialized agents
  - Graceful fallbacks when API is unavailable
  - Robust error handling and recovery
- 🛠️ **Developer-Friendly Architecture**
  - TypeScript for type safety
  - Clean component structure
  - Comprehensive documentation
  - Modular design for easy extension

## 📋 Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Building on this Template](#building-on-this-template)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
  - [Customization Points](#customization-points)
- [Authentication](#authentication)
  - [Setting Up GitHub OAuth](#setting-up-github-oauth)
  - [Custom Authentication Providers](#custom-authentication-providers)
- [Security Hardening](#security-hardening)
  - [Authentication Security](#authentication-security)
  - [API Security](#api-security)
  - [Front-end Security](#front-end-security)
- [OpenAI Integration](#openai-integration)
  - [Setting Up Your API Key](#setting-up-your-api-key)
  - [Adding Custom Agent Types](#adding-custom-agent-types)
- [Optimization Guidelines](#optimization-guidelines)
  - [Performance Optimization](#performance-optimization)
  - [Code Quality](#code-quality)
  - [State Management](#state-management)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository or use it as a template
```bash
git clone https://github.com/yourusername/modern-chat-app.git
cd modern-chat-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables (see [Environment Setup](#environment-setup))

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Setup

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_at_least_32_characters

# GitHub OAuth
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORGANIZATION=your_openai_org_id_optional
OPENAI_MODEL=gpt-4o

# Admin Password
ADMIN_PASSWORD=secure_password_123
```

> 💡 **Security Tip**: In production, use strong, randomly generated strings for secrets. You can generate a secure string using `openssl rand -base64 32` in your terminal.

## 🧩 Building on this Template

### Project Structure

```
app/
├── public/             # Static files
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── api/        # API routes
│   │   │   ├── agents/ # Agent-specific API endpoints
│   │   │   ├── auth/   # Authentication endpoints
│   │   │   ├── chat/   # Main chat API
│   │   │   └── user/   # User-related APIs
│   ├── auth.ts         # NextAuth configuration
│   ├── components/     # React components
│   │   ├── auth/       # Authentication components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .env.example        # Example environment variables
├── .env.local          # Local environment variables (create this)
└── next.config.ts      # Next.js configuration
```

### Key Components

- **src/components/ChatBox.tsx**: Main chat container component
- **src/components/AgentSelector.tsx**: Agent selection UI
- **src/hooks/useChat.ts**: Core chat logic and state management
- **src/utils/apiUtils.ts**: API communication utilities
- **src/auth.ts**: Authentication configuration
- **src/app/api/**: API routes for chat, authentication, and user data

### Customization Points

- **Add New Agent Types**: Extend the agent types in `src/app/api/agents/types/route.ts`
- **Custom Chat Logic**: Modify `src/hooks/useChat.ts` to customize chat behavior
- **UI Customization**: Update Tailwind classes in component files
- **Add New API Endpoints**: Create new routes in the `src/app/api/` directory
- **Extend User Functionality**: Add user preferences, history, etc. in `src/app/api/user/`

## 🔐 Authentication

This application supports both password-based admin login and GitHub OAuth.

### Setting Up GitHub OAuth

1. Go to your [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your Chat App
   - **Homepage URL**: http://localhost:3000 (for development)
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Register the application and copy your Client ID and Secret
5. Add these values to your `.env.local` file

### Custom Authentication Providers

To add more authentication providers:

1. Install the required NextAuth provider package
2. Update `src/auth.ts` to include the new provider:

```typescript
// Example for adding Google authentication
import GoogleProvider from "next-auth/providers/google";

// In the providers array:
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!
}),
```

3. Update the environment variables in `.env.local`

## 🛡️ Security Hardening

### Authentication Security

- **JWT Secret**: Use a strong, randomly generated string for `NEXTAUTH_SECRET`
- **Password Storage**: Replace the simple password check with a proper user database and bcrypt for password hashing
- **Session Management**: Consider adjusting session lifetime in `src/auth.ts`:

```typescript
// In the NextAuth configuration
session: {
  strategy: "jwt",
  maxAge: 60 * 60, // 1 hour instead of the default 30 days
},
```

- **Rate Limiting**: Add rate limiting to authentication endpoints to prevent brute force attacks

### API Security

- **Input Validation**: Add validation to all API inputs using a library like Zod or Joi
- **API Rate Limiting**: Implement rate limiting on all API endpoints
- **Error Handling**: Ensure errors don't leak sensitive information
- **Request Timeout**: All API requests already have timeouts, adjust as needed

### Front-end Security

- **Content Security Policy**: Configure CSP headers to prevent XSS attacks
- **CORS**: Configure CORS policies for production environments
- **Sanitize User Input**: Ensure user inputs are properly sanitized before rendering

## 🤖 OpenAI Integration

### Setting Up Your API Key

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add your key to the `.env.local` file
3. Choose an appropriate model (e.g., gpt-4o, gpt-3.5-turbo)

### Available Agent Types

The application supports multiple agent types for different use cases:

- **General Assistant**: For everyday conversations and general information
- **Code Assistant**: Helps with programming questions and code examples
- **Creative Assistant**: For creative writing and content creation
- **Academic Assistant**: Provides scholarly information and research help

### Adding Custom Agent Types

1. Add a new agent type in `src/app/api/agents/types/route.ts`:

```typescript
myNewAgent: {
  id: 'myNewAgent',
  name: 'My Custom Agent',
  description: 'Specialized for my specific use case',
  icon: '🔮', // Choose an appropriate emoji
},
```

2. Update the agent prompt in `src/utils/openaiUtils.ts` to customize behavior

### Fallback Mode

If no OpenAI API key is provided, the application falls back to a simple rule-based response system. This ensures the app remains functional even without API access.

## ⚡ Optimization Guidelines

### Performance Optimization

- **Component Memoization**: Use React.memo for frequently re-rendered components
- **Lazy Loading**: Implement lazy loading for non-critical components
- **Bundle Analysis**: Use `@next/bundle-analyzer` to identify large dependencies
- **Image Optimization**: Utilize Next.js Image component for optimized images
- **API Response Caching**: Add caching headers to appropriate API responses

### Code Quality

- **Consistent Naming**: Follow established naming conventions
- **Component Splitting**: Keep components focused on a single responsibility
- **Comments**: Add explanatory comments for complex logic
- **Type Safety**: Use proper TypeScript typing and avoid `any` types
- **Error Boundaries**: Implement React Error Boundaries for graceful failure

### State Management

- **Local vs. Global State**: Use local state for component-specific state
- **Context API**: Consider using React Context for deeply shared state
- **Custom Hooks**: Extract reusable stateful logic into custom hooks
- **Immutability**: Always update state immutably for predictable behavior

## 🚀 Deployment

This application can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- **AWS Amplify**: Easily deploy and manage your Next.js app
- **Netlify**: Simple deployment with continuous integration
- **Docker**: Use the provided Dockerfile for containerized deployment

Make sure to configure your environment variables in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔍 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built with ❤️ by [Your Name]
