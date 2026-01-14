// app/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { authClient } from "@/app/lib/auth-client";
import { FaRegSave } from "react-icons/fa";
import { ModalError, ModalSuccess } from "@/components/modals";
import { useSearchParams } from "next/navigation";

type ErrorType = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

type InputsType = {
  email: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

type SaveSuccessType = {
  message: string;
};

export default function SettingsAccountPage() {
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const [allowSave, setAllowSave] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState<boolean>(false);
  const [inputs, setInputs] = useState<InputsType>({
    email: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: ""
  });
  const [saveSuccess, setSaveSuccess] = useState<SaveSuccessType | null>(null);
  const [error, setError] = useState<ErrorType | null>(null);

  // Populate inputs when session is available
  useEffect(() => {
    if (session) {
      setInputs({
        email: session.user?.email || "",
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
      });
    }
  }, [session]);

  // Show success modal if emailChanged param is true
  useEffect(() => {
    if (searchParams.get("error") === "user_not_found") {
      setError({
        message: "The verification link is invalid or has already been used.",
        status: 404,
        statusText: "Not Found"
      });
      return;
    }
    if (searchParams.get("emailChanged") === "true") {
      setSaveSuccess({ message: "Your email has been successfully changed!" });
      return;
    }
  }, [searchParams]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllowSave(true);
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  };


  // Handle save button click
  const handleSave = async () => {
    // Check if there are changes to save
    if (!allowSave) return;

    setLoadingSave(true);
    
    const { data, error } = await authClient.changeEmail({
      newEmail: inputs.email,
      callbackURL: `${window.location.origin}/settings/account?emailChanged=true`
    });

    if (error) {
      setError({
        code: error.code,
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
      setLoadingSave(false);
      return;
    }

    setSaveSuccess({ message: "We sent a verification email to your new address. Please check your inbox to confirm the change." });
    setLoadingSave(false);
    setAllowSave(false);
  }

  const handlePasswordChange = async () => {
    // Check if there are changes to save
    if (!allowSave) return;

    setLoadingChangePassword(true);

    if (inputs.newPassword !== inputs.newPasswordConfirm) {
      setError({
        message: "New password and confirmation do not match.",
        status: 400,
        statusText: "Bad Request"
      });
      setLoadingChangePassword(false);
      return;
    }

    const { data, error } = await authClient.changePassword({
      currentPassword: inputs.currentPassword,
      newPassword: inputs.newPassword
    });

    console.log("changePassword data:", data);

    if (error) {
      setError({
        code: error.code,
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
      setInputs({
        ...inputs,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
      });
      setLoadingChangePassword(false);
      return;
    }

    setInputs({
      ...inputs,
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    });
    setSaveSuccess({ message: "Your password has been successfully changed!" });
    setLoadingChangePassword(false);
    setAllowSave(false);
  }


  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex-1">
      {/* Error Modal */}
      <ModalError 
        open={!!error}
        onClose={() => setError(null)}
        message={error?.message?.split("] ").pop() || "An unknown error occurred."}
      />
      {/* Success Modal */}
      <ModalSuccess 
        open={!!saveSuccess}
        onClose={() => setSaveSuccess(null)}
        message={saveSuccess?.message || "Email updated successfully!"}
      />

      <div className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <Image
            alt="User Avatar"
            src={session?.user?.image || ""}
            width={60}
            height={60}
            className="rounded-full"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold">{session?.user?.name}</h1>
            <p>{session?.user?.email}</p>
          </div>
        </div>
        {/* Profile information */}
        <div>
          <h2 className="text-2xl font-semibold">Account information</h2>
          <div className="divider m-0" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}              
            <div className="max-w-md order-last md:order-first space-y-2">
              <div>
                <h3 className="text-xl font-semibold">Change Email</h3>
                {/* Fields */}
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-sm font-semibold">Email</legend>
                  <input 
                    type="text" 
                    className="input focus:outline-none w-full" 
                    placeholder="Email" 
                    name="email"
                    value={inputs.email}
                    onChange={handleChange}
                  />
                </fieldset>
                {/* Footer with Save button */}
                <div className="flex justify-end mt-2">
                  <button 
                    className="btn bg-[#03C755] hover:bg-[#02a64a] text-white border-[#00b544]" 
                    type="button"
                    disabled={loadingSave}
                    onClick={handleSave}
                  >
                    {loadingSave ? 
                      <div className="flex items-center gap-2">
                        <span className="loading loading-infinity loading-sm"></span>
                        Saving...
                      </div>
                    : (
                      <div className="flex items-center gap-2">
                        <FaRegSave />
                        Save
                      </div>
                    )}  
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Change Password</h3>
                {/* Fields */}
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-sm font-semibold">Current password</legend>
                  <input 
                    type="password" 
                    className="input focus:outline-none w-full" 
                    placeholder="Password" 
                    name="currentPassword"
                    value={inputs.currentPassword}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-sm font-semibold">New password</legend>
                  <input 
                    type="password" 
                    className="input focus:outline-none w-full" 
                    placeholder="New Password" 
                    name="newPassword"
                    value={inputs.newPassword}
                    onChange={handleChange}
                  />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-sm font-semibold">Confirm new password</legend>
                  <input 
                    type="password" 
                    className="input focus:outline-none w-full" 
                    placeholder="Confirm New Password" 
                    name="newPasswordConfirm"
                    value={inputs.newPasswordConfirm}
                    onChange={handleChange}
                  />
                </fieldset>
                {/* Footer with Save button */}
                <div className="flex justify-end mt-2">
                  <button 
                    className="btn bg-[#03C755] hover:bg-[#02a64a] text-white border-[#00b544]" 
                    type="button"
                    disabled={loadingChangePassword}
                    onClick={handlePasswordChange}
                  >
                    {loadingChangePassword ? 
                      <div className="flex items-center gap-2">
                        <span className="loading loading-infinity loading-sm"></span>
                        Saving...
                      </div>
                    : (
                      <div className="flex items-center gap-2">
                        <FaRegSave />
                        Save
                      </div>
                    )}  
                  </button>
                </div>
              </div>

            </div>
            {/* Right Column */}
            <div className="max-w-md order-last md:order-first space-y-2">
              {/* Fields */}
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
