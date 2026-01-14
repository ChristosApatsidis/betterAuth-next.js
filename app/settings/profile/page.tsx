// app/settings/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { authClient } from "@/app/lib/auth-client";
import { TbPhotoEdit } from "react-icons/tb";
import { FaRegSave } from "react-icons/fa";
import { ModalError, ModalSuccess } from "@/components/modals";

type ErrorType = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

type InputsType = {
  name: string;
  email: string;
  image: string;
};

export default function SettingsProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [allowSave, setAllowSave] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [inputs, setInputs] = useState<InputsType>({
    name: "",
    email: "",
    image: ""
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<ErrorType | null>(null);

  // Populate inputs when session is available
  useEffect(() => {
    if (session) {
      setInputs({
        name: session.user?.name || "",
        email: session.user?.email || "",
        image: session.user?.image || ""
      });
    }
  }, [session]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllowSave(true);
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  };

  // Handle file input change for avatar upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files[0]) {      
      // Image upload
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setInputs({
          ...inputs,
          image: inputs.image
        });
      };

      reader.readAsDataURL(file);

      // Clean up file input value to allow re-uploading the same file if needed
      e.target.value = "";

      // Automatically save after selecting a new avatar
      handleSaveImage();
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle save button click
  const handleSave = async () => {
    // Check if there are changes to save
    if (!allowSave) return;

    setLoadingSave(true);
    
    const { error } = await authClient.updateUser({
      name: inputs.name
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

    setSaveSuccess(true);
    setLoadingSave(false);
    setAllowSave(false);
  }

  // Handle saving profile image
  const handleSaveImage = async () => {       
    const { error } = await authClient.updateUser({
      image: inputs.image
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

    setSaveSuccess(true);
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
        message={error?.message || "An unknown error occurred."}
      />
      {/* Success Modal */}
      <ModalSuccess 
        open={saveSuccess}
        onClose={() => setSaveSuccess(false)}
        message="Profile updated successfully!"
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
          <h2 className="text-2xl font-semibold">Profile information</h2>
          <div className="divider m-0" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="max-w-md order-last md:order-first space-y-2">
              {/* Fields */}
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-sm font-semibold">Name</legend>
                <input 
                  type="text" 
                  className="input focus:outline-none w-full" 
                  placeholder="Name" 
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                />
              </fieldset>
              {/* Footer with Save button */}
              <div className="flex justify-end">
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
            {/* Right Column */}
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm font-semibold">Profile picture</legend>
                {inputs.image && 
                <div className="relative w-40 h-40">
                  <Image
                    src={inputs.image}
                    alt="Profile"
                    width={170}
                    height={170}
                    className="rounded-full object-cover border border-base-200"
                  />
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute flex items-center gap-2 bottom-0 right-0 bg-base-200 border border-base-300 rounded-full p-2 shadow hover:bg-base-300 transition cursor-pointer"
                    aria-label="Change profile picture"
                  >
                    <TbPhotoEdit className="w-4 h-4" />
                    <span className="font-semibold">Edit</span> 
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                }
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
