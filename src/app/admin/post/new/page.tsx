import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";

export default async function AdminPostNewPage() {
  return (
    <div>
      <InputText labelText="Nome" placeholder="Digite seu nome" />
      <InputText labelText="Sobrenome" placeholder="Digite seu sobrenome" />
      <InputText
        disabled
        labelText="digite seu nome"
        placeholder="Digite seu sobrenome"
      />
      <InputText
        disabled
        labelText="Sobrenome"
        placeholder="Digite seu sobrenome"
      />
    </div>
  );
}
