import clsx from "clsx";
import React, { useId } from "react";

type InputCheckBoxProps = {
  labelText?: string;
  type?: "checkbox";
} & React.ComponentProps<"input">;

export function InputCheckBox({
  labelText = "",
  type = "checkbox",
  ...props
}: InputCheckBoxProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <input
        className={clsx("w-4 h-4 outline-none ring-2 focus:ring-blue-600")}
        type={type}
        {...props}
        id={id}
      />

      {labelText && (
        <label className="text-sm" htmlFor={id}>
          {labelText}
        </label>
      )}
    </div>
  );
}
