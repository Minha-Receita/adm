"use client";

import { useState, useEffect } from "react";

interface RecipeInfosProps {
  portions: number | undefined
  setPortions: (value: number) => void
  preparationTime: number| undefined;
  setPreparationTime: (value: number) => void
  difficulty: string | undefined
  setDifficulty: (value: string) => void
  categories: string[]| undefined;
  setCategories: (value: string[]) => void
}

export default function RecipeInfos({
  portions,
  setPortions,
  preparationTime,
  setPreparationTime,
  difficulty,
  setDifficulty,
  categories,
  setCategories,
}: RecipeInfosProps) {
  const allCategories = [
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
    "Comida Árabe",
  ];

  const toggleCategory = (category: string) => {
    if (categories?.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...(categories ?? []), category]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Porção por pessoa</label>
        <input
          type="number"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          value={portions}
          onChange={(e) => setPortions(Number(e.target.value))}
        />
      </div>

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
          <option value="" disabled>
            Selecione uma dificuldade
          </option>
          {["Fácil", "Médio", "Difícil"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Categorias</label>
        <div className="mt-2 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-300 p-2 rounded-md">
          {allCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={category}
                checked={categories?.includes(category) ?? false}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
