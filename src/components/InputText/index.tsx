import clsx from "clsx";
import React, { useId } from "react";

type InputTextProps = {
  labelText?: string;
} & React.ComponentProps<"input">;

export function InputText({ labelText = "", ...props }: InputTextProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      {labelText && <label htmlFor={id}>{labelText}</label>}
      <input
        className={clsx(
          "bg-white outline-0 text-base/tight",
          "ring-1 ring-slate-400 rounded",
          "p-2 transition focus:ring-blue-600",
          "placeholder-slate-300",
          "disabled:bg-slate-200",
          "disabled:placeholder-slate-400",
        )}
        {...props}
        id={id}
      />
    </div>
  );
}
