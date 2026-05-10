"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // Ao colocar dentro do useEffect, garantimos que o Next.js vai
    // ignorar o new Date() durante o build e só executá-lo no navegador.
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="pb-16 text-center">
      <p>
        {/* Renderiza o ano apenas depois que o componente carrega no navegador */}
        <span>Copyright &copy; {year !== null ? year : "..."} - </span>
        <Link href="/">The Blog </Link>
      </p>
    </footer>
  );
}
