// app/page.tsx
"use client";

import { authClient } from "@/app/lib/auth-client"
import Card from "@/components/Card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
        <Banner />
        <Card title="Active session">
          <ActiveSession />
        </Card>
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div className="bg-base-200 border border-base-300 rounded">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">NextJS User Auth</h2>
        <p className="mb-4">
          Sign up, sign in, and manage your account with email, password, or social providers—all powered by BetterAuth.
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Sign Up and Sign In functionality with email/password and third-party providers.</li>
          <li>User profile management.</li>
          <li>Email verification using Resend API.</li>
        </ul>
        <div>
          Created with ❤️ by <a href="https://christosapatsidis.com" target="_blank" className="underline text-blue-400">Christos Apatsidis</a>
        </div>
      </div>
    </div>
  )
}

function ActiveSession() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="overflow-x-auto">
      {isPending ?
        <p>Loading session...</p> 
      : 
        <pre>{JSON.stringify(session, null, 2)}</pre>
      }
    </div>
  )
}
