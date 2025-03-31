"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCircle, BookOpenIcon } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  tumbnail: string;
  verified?: boolean; // <- Novo campo
}

export default function ListarReceitas({ issues_mode }: { issues_mode: boolean }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Novo estado para controlar o carregamento

  const router = useRouter();

  // Definir o valor padrão para `issues_mode` se for null ou undefined
  const mode = issues_mode ?? false; // Se issues_mode for null/undefined, será false

  useEffect(() => {
    fetchRecipes();
  }, [mode]);

  const fetchRecipes = () => {
    setLoading(true); // Iniciar o carregamento
    const path_name = mode ? "https://api.mikael.dev.br/recipes/fix/issues" : "https://api.mikael.dev.br/recipes/";
    fetch(path_name)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false); // Finalizar o carregamento
      })
      .catch((err) => {
        console.error("Erro ao buscar receitas", err);
        setLoading(false); // Finalizar o carregamento em caso de erro
      });
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
      {/* Card de contagem de receitas */}
      <div className="max-w-lvw p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <BookOpenIcon className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" />
      <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white flex items-center">
        <span className="mr-2">Total de Receitas Cadastradas</span> 🥳😁🎈
      </h5>
      <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Antes de adicionar uma receita, siga estas regras:</p>
      <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 mb-4">
        <li>Verifique se todos os detalhes da receita estão corretos.</li>
        <li>Imagens de ingredientes devem ter fundo branco.</li>
        <li>Descreva o modo de preparo de forma clara e objetiva.</li>
      </ul>
      <a href="#" className="inline-flex font-medium items-center text-blue-600 hover:underline">
        {recipes.length} receitas cadastradas
        {/* Ícone de seta */}
        <svg
          className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
          />
        </svg>
      </a>
    </div>

      <h1 className="text-3xl font-bold mb-6">Listar Receitas</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Feedback de carregamento */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-gray-200 border-t-transparent rounded-full" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      )}

      {/* Tabela moderna */}
      {!loading && (
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
      )}

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
