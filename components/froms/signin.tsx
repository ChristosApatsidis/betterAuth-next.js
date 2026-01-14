// components/froms/signin.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { SignInButton } from "@/components/buttons";

type SignInResponse = {
  data?: {
    redirect: boolean;
    token: string;
    url?: string | undefined;
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
  } | null | undefined;
  error?: AuthErrorType | null;
};

type AuthErrorType = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

/**
 * Renders the Sign In form component.
 *
 * This component provides a user interface for signing in with email and password,
 * displays error messages, handles loading state, and offers social sign-in options
 * (GitHub and Google). It also includes a link to the sign-up page for new users.
 *
 */
export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<AuthErrorType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Clear error when input changes
  useEffect(() => {
    setError(null);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty fields
    if (!email || !password) {
      // Create a custom error object for empty fields
      setError({ 
        code: "EMPTY_FIELDS",
        message: "Email and password are required.", 
        status: 400, 
        statusText: "Bad Request" 
      });
      return;
    }

    // Proceed with signin
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password, rememberMe }) as SignInResponse;

    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    setLoading(false);

    // Redirect to home page
    router.push("/");
  }

  return (
    <div className="bg-base-200 border border-base-300 p-6 rounded shadow-md w-full sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>

        {error && <div className="mb-4 text-error">{error.message}</div>}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`input input-bordered w-full focus:outline-none ${error?.code === "INVALID_EMAIL_OR_PASSWORD" ? "input-error" : ""}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`input input-bordered w-full focus:outline-none ${error?.code === "INVALID_EMAIL_OR_PASSWORD" ? "input-error" : ""}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(keyEvent) => keyEvent.key === 'Enter' ? handleSubmit(keyEvent) : null}
            />
          </div>
          <div>
            <label className="label">
              <input 
                type="checkbox" 
                className="checkbox checkbox-xs" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner"></span>}
            Sign In
          </button>
        </div>
      </form>

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          Not have an account? <span className="text-primary"><Link href="/signup">Sign Up</Link></span>
        </p>
      </div>
      
      {/* Divider */}
      <div className="divider mt-2 mb-2" />

      {/* Social Sign In Links */}
      <div className="flex flex-col gap-4">
        <SignInButton 
          provider="google" 
          className="btn btn-md bg-stone-200 text-black hover:bg-stone-100 flex" 
          text="Sign in with Google"
          icon={<FcGoogle size={16} />}
        />
      </div>
    </div>
  );
}