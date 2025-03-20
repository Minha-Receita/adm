"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCircle } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  tumbnail: string;
  verified?: boolean; // <- Novo campo
}

export default function ListarReceitas() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    fetch("https://api.mikael.dev.br/recipes/")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Erro ao buscar receitas", err));
  };

  const handleEdit = (id: string) => {
    router.push(`/receitas/criar/${id}`);
  };

  const handleDelete = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    try {
      const response = await fetch(`https://api.mikael.dev.br/recipes/${recipeToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Receita deletada com sucesso!");
        fetchRecipes(); // Atualiza a lista após deletar
      } else {
        alert("Erro ao deletar receita.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
      console.error(error);
    } finally {
      setShowModal(false);
      setRecipeToDelete(null);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const searchLower = search.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Listar Receitas</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          className="p-3 w-full border border-gray-300 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabela moderna */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-amber-500 text-white uppercase text-sm font-semibold">
            <tr>
              <th className="p-4">Foto</th>
              <th className="p-4 w-1/3">Título</th>
              <th className="p-4">Descrição</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-gray-100 transition">
                  <td className="p-4">
                    <img
                      src={recipe.tumbnail || "https://via.placeholder.com/150"}
                      alt={recipe.title}
                      className="w-32 h-20 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {recipe.title}
                      {recipe.verified && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                          <CheckCircle size={14} />
                          Verificado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{recipe.description}</td>
                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(recipe.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe)}
                      className="text-red-600 hover:text-red-800"
                      title="Excluir"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Nenhuma receita encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <p className="text-lg font-semibold">
              Tem certeza que deseja excluir a receita "{recipeToDelete?.title}"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sim, Excluir
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
