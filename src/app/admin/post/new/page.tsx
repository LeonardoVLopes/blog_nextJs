import { Button } from "@/components/Button";
import { InputCheckBox } from "@/components/InputCheckBox";
import { InputText } from "@/components/InputText";

export default async function AdminPostNewPage() {
  return (
    <form action="">
      <div className="flex flex-col gap-6">
        <InputText labelText="Nome" placeholder="Digite seu nome" />
        <InputText labelText="Sobrenome" placeholder="Digite seu sobrenome" />
        <InputCheckBox labelText="sobrenome" />
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

        <div className="mt-4">
          <Button type="submit">Enviar</Button>
        </div>
      </div>
    </form>
  );
}
