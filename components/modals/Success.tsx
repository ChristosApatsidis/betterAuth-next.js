// components/modals/Success.tsx
"use client";

import { useEffect } from "react";
import { MdCheckCircleOutline } from "react-icons/md";

export default function ModalSuccess(props: { 
  open: boolean, 
  message: string, 
  onClose?: () => void 
}) {
  const modalId = `success_modal_${Math.random().toString(16)}`;

  useEffect(() => {
    if (props.open) {
      const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
      dialog?.showModal(); 
    } 
  }, [props.open]);

  return (
    <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <form method="dialog">
          <button 
            className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2"
            onClick={props.onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Success</h3>
        {/* Success Message */}
        <div className="allign-center flex flex-col justify-center items-center text-center">
          <MdCheckCircleOutline className="text-green-500 w-24 h-24" />
          <p className="py-4">{props.message}</p>
        </div>
      </div>
    </dialog>
  );  
}