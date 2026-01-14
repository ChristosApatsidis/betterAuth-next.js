// app/profile/page.tsx
"use client";

import Image from "next/image";
import { authClient } from "@/app/lib/auth-client";
export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-4">

      <div className="space-y-4">
        {/* User Info */}
        <div className="flex gap-4">
          {session?.user?.image && (
            <Image
              alt="User Avatar"
              src={session?.user?.image}
              width={160}
              height={160}
              className="rounded-full"
              priority
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{session?.user?.name}</h1>
            <p>{session?.user?.email}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
