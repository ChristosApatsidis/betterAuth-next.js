// app/signup/page.tsx
"use client";

import { useState } from "react";
import { SignUpForm } from "@/components/froms";

export default function SignUpPage() {

  return (
    <div className="container mx-auto px-4 pt-4">
      <SignUpForm />
    </div>
  );
} 