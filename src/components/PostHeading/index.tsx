import Link from "next/link";
import React from "react";

type PostHeadingPros = {
  children: React.ReactNode;
  url: string;
  as?: "h1" | "h2";
};

export function PostHeading({
  children,
  url,
  as: Tag = "h2",
}: PostHeadingPros) {
  const headingClassesMap = {
    h1: "text-2xl/tight font-extrabold sm:text-4xl",
    h2: "text-2xl/tight bg-red-500 sm:text-4xl",
  };

  const commonClasses = "font-extrabold";

  return (
    <Tag className={(headingClassesMap[Tag], commonClasses)}>
      <Link href={url}>{children}</Link>
    </Tag>
  );
}
