"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Ingredient {
  title: string;
  description: string;
}

interface Preparation {
  step: number;
  title: string;
  description: string;
}

interface Session {
  id: number;
  title: string;
}

export default function CriarReceita() {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ title: "", description: "" }]);
  const [preparations, setPreparations] = useState<Preparation[]>([{ step: 1, title: "", description: "" }]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  //posso varias categorias para uma receita
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [portions, setPortions] = useState<number>(1);
  const [preparationTime, setPreparationTime] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("Fácil");
  const params = useParams();
  const router = useRouter();
  const recipeId = params?.id;

  useEffect(() => {
    fetch("https://mikael.dev.br/sessions/")
      .then((res) => res.json())
      .then(setSessions)
      .catch((err) => console.error("Erro ao buscar sessões", err));

    if (recipeId) {
      fetch(`https://mikael.dev.br/recipes/${recipeId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setDescription(data.description);
          setImageUrl(data.images?.[0]?.url || "");
          setSelectedSession(data.session_id || null);
          setPortions(data.portions || 1);
          setPreparationTime(data.preparation_time || 0);
          setDifficulty(data.difficulty || "Fácil");
          setIngredients(
            data.ingredients?.map((ing: any) => ({
              title: ing.title,
              description: ing.description,
            })) || []
          );

          setPreparations(
            data.preparations?.map((prep: any, index: number) => ({
              step: index + 1,
              title: prep.title,
              description: prep.description,
            })) || []
          );
        })
        .catch((err) => console.error("Erro ao carregar receita", err));
    }
  }, [recipeId]);

  const handleAddIngredient = () => setIngredients([...ingredients, { title: "", description: "" }]);

  const handleUpdateIngredient = (index: number, field: "title" | "description", value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

  const handleAddStep = () => setPreparations([...preparations, { step: preparations.length + 1, title: "", description: "" }]);

  const handleUpdateStep = (index: number, field: "title" | "description", value: string) => {
    const updated = [...preparations];
    updated[index][field] = value;
    setPreparations(updated);
  };

  const handleRemoveStep = (index: number) => {
    setPreparations(
      preparations.filter((_, i) => i !== index).map((step, idx) => ({ ...step, step: idx + 1 }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSession) {
      alert("Selecione uma sessão para essa receita!");
      return;
    }

    const payload = {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      ingredients,
      preparations,
      session_id: selectedSession,
      portions,
      preparation_time: preparationTime,
      dificulty: difficulty,
      categories: selectedCategories,
      download_image: true,
      property:'admin'
    };

    try {
      const method = recipeId ? "PUT" : "POST";
      const url = recipeId
        ? `https://mikael.dev.br/recipes/${recipeId}`
        : "https://mikael.dev.br/recipes/";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Receita ${recipeId ? "atualizada" : "criada"} com sucesso!`);
        router.push("/receitas/listar");
      } else {
        alert("Erro ao salvar receita.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full bg-gray-50 p-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {recipeId ? "Editar Receita" : "Criar Receita"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-max space-y-6">
        {imageUrl && (
          <div className="flex justify-center mt-4 p-2 bg-gray-100 border border-gray-300 rounded-lg">
            <img src={imageUrl} alt="Preview" className="w-full max-h-80 object-contain rounded-md shadow-md" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">URL da Foto da Receita</label>
          <input
            type="url"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Título da Receita</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            rows={3}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Sessão */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sessão</label>
          <select
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={selectedSession ?? ""}
            onChange={(e) => setSelectedSession(Number(e.target.value))}
          >
            <option value="" disabled>Selecione uma sessão</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title}
              </option>
            ))}
          </select>
        </div>
        {/* portions */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Porção por pessoa</label>
          <input
            type="number"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={portions}
            onChange={(e) => setPortions(Number(e.target.value))}
          />
        </div>
        {/* tempo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempo de preparo</label>
          <input
            type="number"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={preparationTime}
            onChange={(e) => setPreparationTime(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dificuldade</label>
          <select
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            value={difficulty ?? ""}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="" disabled>Selecione uma sessão</option>
            {["Fácil", "Médio", "Difícil"].map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
          {/* ategorias select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Categorias</label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-300 p-2 rounded-md">
              {[
                "Café da manhã",
                "Almoço",
                "Jantar",
                "Sobremesa",
                "Massas",
                "Carnes",
                "Saladas",
                "Bebidas",
                "Vegano",
                "Vegetariano",
                "Fitness",
                "Lanches",
                "Sopas",
                "Frutos do Mar",
                "Doces Fit",
                "Sem Glúten",
                "Low Carb",
                "Comida Internacional",
                "Aperitivos",
                "Receitas Rápidas",
                "Receitas para Crianças",
                "Churrasco",
                "Comida Brasileira",
                "Comida Italiana",
                "Comida Japonesa",
                "Receitas Econômicas",
                "Cozinha de Micro-ondas",
                "Receitas para Festas",
                "Pães e Bolos",
                "Comida Árabe"
              ].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>


        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
          <div className="space-y-4">
            {ingredients.map((item, index) => (
              <div key={index} className="border p-4 space-y-2 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Ingrediente {index + 1}</span>
                  <button type="button" className="text-red-500" onClick={() => handleRemoveIngredient(index)}>🗑️</button>
                </div>
                <input type="text" className="w-full border p-2 rounded" value={item.title} onChange={(e) => handleUpdateIngredient(index, "title", e.target.value)} />
                <textarea className="w-full border p-2 rounded" value={item.description} onChange={(e) => handleUpdateIngredient(index, "description", e.target.value)} />
              </div>
            ))}
            <button type="button" className="text-blue-600" onClick={handleAddIngredient}>+ Adicionar Ingrediente</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Modo de Preparo</label>
          <div className="space-y-4">
            {preparations.map((step, index) => (
              <div key={index} className="border p-4 space-y-2 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Passo {step.step}</span>
                  <button type="button" className="text-red-500" onClick={() => handleRemoveStep(index)}>🗑️</button>
                </div>
                <input type="text" className="w-full border p-2 rounded" value={step.title} onChange={(e) => handleUpdateStep(index, "title", e.target.value)} />
                <textarea className="w-full border p-2 rounded" value={step.description} onChange={(e) => handleUpdateStep(index, "description", e.target.value)} />
              </div>
            ))}
            <button type="button" className="text-blue-600" onClick={handleAddStep}>+ Adicionar Passo</button>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white p-3 rounded-md">{recipeId ? "Atualizar Receita" : "Criar Receita"}</button>
      </form>
    </div>
  );
}
