import clsx from "clsx";
import React from "react";

type ButtonVariants = "default" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariants;
  size?: ButtonSize;
} & React.ComponentProps<"button">;

export function Button({
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const buttonVariants: Record<ButtonVariants, string> = {
    default: clsx("bg-blue-600 text-blue-100"),
    ghost: clsx("bg-slate-200 text-slate-900"),
    danger: clsx("bg-red-600 text-red-100"),
  };

  const buttonSizes: Record<ButtonSize, string> = {
    sm: clsx(""),
    md: clsx(""),
    lg: clsx(""),
  };

  const buttonClasses = clsx(buttonVariants[variant], buttonSizes[size]);

  return <button className={buttonClasses} {...props} />;
}
