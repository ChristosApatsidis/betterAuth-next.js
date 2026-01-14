// components/SettingsMenu.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export default function SettingsMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (path: string) => {
    router.push(path);
  }

  return (
    <aside className="w-full md:w-64">
      <ul className="space-y-2">
        <li 
          className={`hover:bg-base-300 p-2 rounded text-lg font-medium font-semibold flex items-center cursor-pointer ${pathname === "/settings/profile" ? "bg-base-300" : ""}`}
          onClick={() => navigateTo("/settings/profile")}
          role="button"
        >
          <FaRegUser className="inline mr-2" />
          Profile
        </li>
        <li 
          className={`hover:bg-base-300 p-2 rounded text-lg font-medium font-semibold flex items-center cursor-pointer ${pathname === "/settings/account" ? "bg-base-300" : ""}`}
          onClick={() => navigateTo("/settings/account")}
          role="button"
        >
          <IoSettingsOutline className="inline mr-2" />
          Account
        </li>
      </ul>
    </aside>
  );
}