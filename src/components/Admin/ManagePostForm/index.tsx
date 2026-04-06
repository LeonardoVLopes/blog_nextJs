"use client";

import { Button } from "@/components/Button";
import { InputCheckBox } from "@/components/InputCheckBox";
import { InputText } from "@/components/InputText";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { useState } from "react";

export function ManagePostForm() {
  const [contentValue, setContentValue] = useState("este e um exemplo");

  return (
    <form action="" className="mb-16">
      <div className="flex flex-col gap-6">
        <InputText labelText="Nome" placeholder="Digite seu nome" />
        <InputText labelText="Sobrenome" placeholder="Digite seu sobrenome" />
        <InputCheckBox labelText="sobrenome" />
        <InputText
          disabled
          labelText="digite seu nome"
          placeholder="Digite seu sobrenome"
        />

        <MarkdownEditor
          labelText="conteudo"
          disabled={false}
          textAreaName="content"
          value={contentValue}
          setValue={setContentValue} 
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
