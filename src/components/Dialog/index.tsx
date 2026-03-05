"use client";

import clsx from "clsx";
import React from "react";

type DialogProps = {
  isVisible: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  disable: boolean;
};

export function Dialog({
  isVisible = false,
  title,
  content,
  onCancel,
  onConfirm,
  disable,
}: DialogProps) {
  if (!isVisible) return null;

  function handleCancel() {
    if (disable) return;

    onCancel();
  }

  return (
    <div
      className={clsx(
        "fixed z-50 inset-0 bg-black/50 backdrop-blur-xs",
        "flex items-center justify-center",
      )}
      onClick={handleCancel}
    >
      <div
        className={clsx(
          "bg-slate-100 p-6 rounded-lg max-w-2xl mx-6",
          "flex flex-col gap-6",
          "shadow-lg shadow-black/30 text-center",
        )}
        role="dialog"
        aria-modal={true}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="dialog-title" className="text-xl font-extrabold">
          {title}
        </h3>
        <div id="dialog-description">{content}</div>
        <div className="flex items-center justify-around">
          <button
            className={clsx(
              "bg-slate-300 hover:bg-slate-400 transition text-slate-950",
              "flex items-center justify-center",
              "py-2 px-4 rounded-lg cursor-pointer",
            )}
            autoFocus
            onClick={handleCancel}
            disabled={disable}
          >
            Cancelar
          </button>
          <button
            className={clsx(
              "bg-blue-500 hover:bg-blue-600 transition text-blue-50",
              "flex items-center justify-center",
              "py-2 px-4 rounded-lg cursor-pointer",
            )}
            onClick={onConfirm}
            disabled={disable}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
