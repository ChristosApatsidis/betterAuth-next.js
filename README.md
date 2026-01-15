# Next.js - Better Auth User Authentication

This project is a Next.js application featuring user authentication, profile management, and settings. It demonstrates modern authentication flows using Better Auth.

## Features
- User sign up and sign in
- Profile and account management
- Email verification
- Error and success modals

## Project Structure
```
app/
  api/auth/[...all]/route.ts   # Authentication API routes
  lib/                         # Auth and password utilities
  profile/                     # User profile page
  settings/                    # Account and profile settings
  signin/                      # Sign in page
  signup/                      # Sign up page
components/
  Card.tsx, Navbar.tsx, ...    # UI components
  buttons/, forms/, modals/    # Reusable UI elements
utils/sendVerificationEmail.ts # Email utility
```

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env.local` file and add your secrets:
```
BETTER_AUTH_SECRET=           # Secret key for JWT or session encryption
BETTER_AUTH_URL=              # Base URL of your app

BETTER_AUTH_GOOGLE_ID=        # Google OAuth Client ID
BETTER_AUTH_GOOGLE_SECRET=    # Google OAuth Client Secret

MONGODB_URI=                  # MongoDB connection string

SMTP_HOST=                    # SMTP server host (e.g., smtp.ethereal.email)
RESEND_API_KEY=               # Resend API key
```

## License
MIT
