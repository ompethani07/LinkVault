# LinkVault - Professional Link Management Platform

A secure, professional link management platform built with Next.js and Clerk authentication.

## Features

- 🔐 **Secure Authentication** - Google OAuth integration via Clerk
- 🎨 **Professional UI** - Modern 3D logo and gradient design
- 📁 **File Management** - Upload and manage files alongside links
- 🗂️ **Smart Organization** - Categorize links with tags and collections
- 📊 **Analytics Dashboard** - Track your link performance
- 🔗 **Easy Link Management** - Add, edit, and delete links with ease
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
linkvault/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── sign-in/           # Sign-in page
│   │   ├── sign-up/           # Sign-up page
│   │   ├── welcome/           # Welcome flow
│   │   ├── layout.tsx         # Root layout with Clerk provider
│   │   └── page.tsx           # Landing page
│   └── components/            # Reusable components
├── middleware.ts              # Clerk middleware
└── ...
```

## Authentication Flow

1. User lands on the homepage with 3D LinkVault logo
2. Clicks "Get Started with Google" to sign in via Clerk
3. After authentication, redirected to welcome flow
4. Welcome flow has 3 professional steps (Welcome → Features → Ready)
5. Finally redirected to main dashboard with full functionality

## Dashboard Features

- **Add Links**: Professional modal to add new links with categories
- **File Upload**: Upload files and manage them like links
- **Categories**: Organize links by categories (General, Work, Personal, etc.)
- **Statistics**: View analytics about your links and files
- **Professional UI**: Clean, modern interface with smooth animations

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/welcome
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/welcome
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License
