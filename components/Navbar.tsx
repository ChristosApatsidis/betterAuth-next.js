// components/Navbar.tsx
"use client";

import { useEffect } from "react";
import { authClient } from "@/app/lib/auth-client"
import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "@/components/themeSwitcher";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  useEffect(() => {
    // Refresh session on error
    if (error) {
      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [error]);

  const signOutAction = async () => {
    await authClient.signOut({
      fetchOptions: { 
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }

  return (
    <div className="navbar bg-base-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex px-4">
        {/* Navbar Start */}
        <div className="navbar-start">
          <Link 
            href="/" 
            className="font-bold text-xl"
          >
            NextJS User Auth
          </Link>
        </div>
        {/* Navbar End */}
        <div className="navbar-end">
          {session && !isPending && (
            /* User Avatar and Dropdown */
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {session.user?.image && (
                    <Image
                      alt="User Avatar"
                      src={session.user?.image}
                      width={40}
                      height={40}
                      className="rounded-full"
                      priority
                    />
                  )}
                  {!session.user?.image && (
                    <div className="bg-base-300 flex items-center justify-center h-full w-full rounded-full text-xl text-base-content">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </div>
              <ul
                className="menu menu-sm dropdown-content bg-base-300 z-10 mt-3 w-52 p-2 shadow rounded-lg">
                <li>
                  <a className="rounded hover:scale-101 transition-transform duration-200" href="/profile">
                    <FaRegUser className="inline" />
                    Profile
                  </a>
                </li>
                <li>
                  <a className="rounded hover:scale-101 transition-transform duration-200" href="/settings">
                    <IoSettingsOutline className="inline" />
                    Settings
                  </a>
                </li>
                <li>
                  <ThemeSwitcher 
                    text="Switch theme" 
                    className="hover:scale-101 transition-transform duration-200"
                  />
                </li>
                <div className="divider m-0"></div>
                <li>
                  <button className="rounded font-semibold hover:text-error/90 hover:scale-101 transition-transform duration-200" 
                    type="button" 
                    onClick={signOutAction}
                  >
                    <IoLogOutOutline className="inline" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
          {!session && !isPending && (
            /* Sign In Link */
            <div className="flex items-center space-x-2">
              <ThemeSwitcher size={22} />
              <Link
                href="/signin"
                className="font-semibold"
              >
                Sign In
              </Link>
            </div>
          )}
          {isPending && (
            /* Loading State */
            <div className="animate-pulse text-primary-content">
              Loading...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}