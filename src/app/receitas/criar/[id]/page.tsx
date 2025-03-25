"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RecipeTextFieldInput from "../../components/text_field";
import { useRecipeViewModel } from "../../controller/recipe_controller";
import SelectField from "../../components/options";
import GenericList from "../../components/description_list";
import RecipeInfos from "../../components/recipe_infos";

export default function CriarReceita() {
  const params = useParams();
  var recipeId = params?.id;
  const router = useRouter();

  const {
    recipe,
    loading,
    sessions,
    imgs_ingredients,
    updateField,
    init,
    save,
  } = useRecipeViewModel(recipeId ? Number(recipeId) : undefined);

  useEffect(() => {
    if (recipeId == '0') {
      recipeId = undefined;
    }
    init(recipeId ? Number(recipeId) : undefined);

  }, [recipeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start h-full bg-gray-50 p-8 w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 w-full">
        {recipeId ? "Editar Receita" : "Criar Receita"}
      </h1>

      <form className="bg-white p-6 rounded-lg shadow-md space-y-6 w-full">
      
        {recipe!.images?.[0]?.url && (
          <div className="flex justify-center mt-4 p-2 bg-gray-100 border border-gray-300 rounded-lg">
            <img src={recipe!.images[0].url} alt="Preview" className="w-full max-h-80 object-contain rounded-md shadow-md" />
          </div>
        )}

        <RecipeTextFieldInput
          title="Imagem da Receita"
          value={recipe!.images?.[0]?.url}
          onChange={(value) => updateField("images", [{ url: value.target.value }])}
          placeholder="URL da imagem"
        />

        <RecipeTextFieldInput
          title="Título da Receita"
          value={recipe!.title}
          onChange={(value) => updateField("title", value.target.value)}
        />

        <RecipeTextFieldInput
          title="Descrição"
          value={recipe!.description}
          onChange={(value) => updateField("description", value.target.value)}
        />
        <RecipeInfos
          portions={recipe!.portions}
          setPortions={(value) => updateField("portions", value)}
          preparationTime={recipe!.preparation_time}
          setPreparationTime={(value) => updateField("preparation_time", value)}
          difficulty={recipe!.dificulty}
          setDifficulty={(value) => updateField("dificulty", value)}
          categories={recipe!.categories}
          setCategories={(value) => updateField("categories", value)}
        />
        <SelectField
          label="Sessão"
          value={sessions.find((s) => s.id === recipe!.session_id)?.id ?? ""}
          onChange={(value) => updateField("session_id", Number(value))}
          options={sessions.map((s) => ({ label: s.title, value: s.id }))}
          placeholder="Selecione uma sessão"
        />
        <GenericList
          dafaultImages={imgs_ingredients}
          items={recipe!.ingredients?.map((ingredient) => ({
            description: ingredient.description,
            title: ingredient.title ?? ""
          })) ?? []}
          setItems={(items) => updateField("ingredients", items as Ingredient[])}
          label="Ingredientes"
          itemLabelPrefix="Ingrediente"
          withQuantity={true}
          withSelectImage={true}
        />
        <GenericList
        dafaultImages={imgs_ingredients}
          items={recipe!.preparations?.map((preparation) => ({
            step: preparation.step,
            title: preparation.title,
            description: preparation.description,
            image_url: preparation.image_url ?? ""
          })) ?? []}
          setItems={(items) => updateField("preparations", items as Preparation[])}
          label="Preparo"
          itemLabelPrefix="Passo"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-500 text-white p-2 rounded-md w-full"
          value={recipeId ? "Editar Receita" : "Criar Receita"}
        >
          {recipeId ? "Editar Receita" : "Criar Receita"}
        </button>
      </form>
    </div>
  );
}