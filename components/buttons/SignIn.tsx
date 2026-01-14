// components/buttons/SignIn.tsx
"use client";

import { authClient } from "@/app/lib/auth-client";
 
export default function SignInButton(props: { 
  provider: string;
  className?: string;
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={async () => {
        await authClient.signIn.social({
          provider: props.provider,
          callbackURL: "/", 
          errorCallbackURL: "/error",
          newUserCallbackURL: "/"
        });
      }}
      className={`${props.className}`} 
    >
      {props.icon}
      {props.text}
    </button>
  )
} 