// app/signin/page.tsx
"use client";

import { SignInForm } from "@/components/froms";

export default function SignInPage() {

  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-start">
        <SignInForm />
     </div>
    </div>
  );
} 