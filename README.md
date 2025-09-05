# Modern Chat Application

A modern, responsive chat application built with Next.js, TypeScript, Tailwind CSS, and NextAuth.js. This application provides a secure authentication system using both password-based login and GitHub OAuth, along with a clean UI for real-time chat interactions.

## Features

- 🔒 **Secure Authentication**
  - Password-based login for admin access
  - GitHub OAuth integration
  - JWT-based session management
- 💬 **Modern Chat Interface**
  - Responsive design that works on all devices
  - Real-time typing indicators
  - Auto-scrolling chat window
  - Smooth animations and transitions
- 🤖 **AI Integration**
  - OpenAI API integration for intelligent responses
  - Multiple agent types for different use cases
  - Fallback responses when API key is not available
- 🛠️ **Developer-Friendly**
  - TypeScript for type safety
  - Clean component structure
  - Well-documented code
  - Easy to extend and customize

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Copy the `.env.example` file to `.env.local` and fill in the required values:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting Up GitHub OAuth

To enable GitHub login, follow these steps:

1. Go to your [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your Chat App
   - **Homepage URL**: http://localhost:3000 (for development)
   - **Application description**: (Optional) A description of your app
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Click "Register application"
5. On the next screen, copy your Client ID
6. Click "Generate a new client secret" and copy the generated secret
7. Add these values to your `.env.local` file:
   ```
   GITHUB_ID=your_client_id_here
   GITHUB_SECRET=your_client_secret_here
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```
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

## Authentication Flow

This application supports two authentication methods:

1. **Password Authentication**:
   - A predefined password (`secure_password_123`) is used for admin access
   - In a production environment, you should replace this with a secure user database

2. **GitHub OAuth**:
   - Users can sign in with their GitHub account
   - Basic user information (username, profile image) is retrieved and displayed
   - User data can be stored in a database for persistence

## OpenAI Integration

This application integrates with OpenAI's API to provide intelligent chat responses. To set up:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add your key to the `.env.local` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4o  # or another model of your choice
   ```

### Available Agent Types

The application supports multiple agent types for different use cases:

- **General Assistant**: For everyday conversations and general information
- **Code Assistant**: Helps with programming questions and code examples
- **Creative Assistant**: For creative writing and content creation
- **Academic Assistant**: Provides scholarly information and research help

### Fallback Mode

If no OpenAI API key is provided, the application falls back to a simple rule-based response system.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Make sure to configure your environment variables in your deployment platform.
