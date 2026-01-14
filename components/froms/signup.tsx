// components/froms/signup.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import SignInButton from "@/components/buttons/SignIn";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type SignUpResponse = {
  data: {
    token: string | null;
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined | undefined;
    };
  };
  error?: AuthErrorType | null;
};

type AuthErrorType = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

/**
 * Renders the sign up form component for user registration.
 *
 * This component provides input fields for first name, last name, email, password, and password confirmation.
 * It handles form validation, displays error messages, and manages loading state during the sign up process.
 * If email verification is required, it displays a message prompting the user to verify their email.
 * Also includes social sign up options with GitHub and Google.
 */
export default function SignUpForm() {
  const router = useRouter();

  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [error, setError] = useState<AuthErrorType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState<boolean>(false);

  // Clear error when input changes
  useEffect(() => {
    setError(null);
  }, [firstname, lastname, email, password, passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty fields
    if (!firstname || !lastname || !email || !password) {
      // Create a custom error object for empty fields
      setError({ 
        code: "EMPTY_FIELDS", 
        message: "All fields are required.", 
        status: 400, 
        statusText: "Bad Request" 
      });
      return;
    }

    // Check password match
    if (password !== passwordConfirm) {
      // Create a custom error object for password mismatch
      setError({ 
        code: "PASSWORDS_DO_NOT_MATCH", 
        message: "Passwords do not match.", 
        status: 400, 
        statusText: "Bad Request" 
      });
      return;
    }

    // Proceed with signup
    setLoading(true);

    const { data, error } = await authClient.signUp.email({ 
      name: `${firstname} ${lastname}`, 
      email, 
      password 
    }) as SignUpResponse;

    if (error) {
      setLoading(false);  
      setError(error);
      return;
    }

    setLoading(false);

    // Check if email verification is required
    if (data?.user && !data.user.emailVerified) {
      setRequireEmailVerification(true);
      return;
    }

    // Redirect to home page
    router.push("/");
  }

  return (
    <div className="bg-base-200 border border-base-300 p-6 rounded shadow-md w-full sm:max-w-md">
    {requireEmailVerification ? (
      <div>
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">A verification email has been sent to {email}.</p>
        <p className="text-sm text-gray-300">After verifying your email, you can sign in to your account.</p>
      </div>
    ) : (
      <div>
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

          {error && <div className="mb-4 text-error">{error.message}</div>}

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full focus:outline-none"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full focus:outline-none"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`input input-bordered w-full focus:outline-none ${error?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ? "input-error" : ""}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`input input-bordered w-full focus:outline-none ${error?.code === "PASSWORD_TOO_SHORT" || error?.code === "PASSWORDS_DO_NOT_MATCH" ? "input-error" : ""}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`input input-bordered w-full focus:outline-none ${error?.code === "PASSWORDS_DO_NOT_MATCH" ? "input-error" : ""}`}
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Sign Up
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="divider mt-2 mb-2" />

        {/* Social Sign In Links */}
        <div className="flex flex-col gap-4">
          <SignInButton 
            provider="google" 
            className="btn btn-md bg-stone-200 text-black hover:bg-stone-100 flex" 
            text="Sign up with Google"
            icon={<FcGoogle size={16} />}
          />
        </div>
      </div>
    )}
    </div>
  );
}