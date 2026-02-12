import { Header } from "@/components/Header";
import "./globals.css";
import { Container } from "@/components/Container";
import { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "The blog - Este e um blog com Next.JS",
    template: "%S | The Blog",
  },
  description: "Essa seria a descricao dessa pagina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Container>
          <Header />

          <body>{children}</body>

          <Footer />
        </Container>
      </body>
    </html>
  );
}
