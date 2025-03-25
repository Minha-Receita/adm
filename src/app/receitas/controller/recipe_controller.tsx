import build from "next/dist/build";
import path from "path";
import { useState} from "react";

export function useRecipeViewModel(recipeId?: number) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [imgs_ingredients, setImgsIngredients] = useState<Image[]>([]);
    
    const init = async (id?: number) => {
        setLoading(true);
      
        if (id) {
          try {
            await Promise.all([
              getRecipeById(id),
              getSessions(),
              getAllIngredients()
            ]);
          } catch (err) {
            alert("Erro ao buscar receita");
          }
        } else {
            await Promise.all([
                getSessions(),
                getAllIngredients()
              ]);
          buildRecipe({} as Recipe);
        }
        setLoading(false);
      };
    const getSessions = async () => {
        const response = await fetch("https://api.mikael.dev.br/sessions/");
        const data = await response.json();
        setSessions(data);
    };

    const getRecipeById = async (id: number) => {
        const response = await fetch(`https://api.mikael.dev.br/recipes/${id}`);
        const data = await response.json();
        buildRecipe(data);
    };
    const buildRecipe = (recipe: Recipe) => {
        if (recipeId) {
            setRecipe(recipe);
        } else {
            setRecipe({
                title: "",
                description: "",
                thumbnail: "",
                ingredients: [],
                preparations: [],
                session_id: 1,
                portions: 1,
                preparation_time: 0,
                dificulty: "Fácil",
                categories: [],
                download_image: false,
                property: "admin",
            });
        }
    }

    const updateField = <K extends keyof Recipe>(key: K, value: Recipe[K]) => {
        setRecipe({ ...recipe, [key]: value });
    };

    const save = async () => {
        if (!recipe) return alert("Erro ao salvar receita");

        setLoading(true);
        recipe.categories = [];
        const method = recipe.id ? "PUT" : "POST";
        const url = recipe.id
            ? `https://api.mikael.dev.br/recipes/${recipe.id}`
            : "https://api.mikael.dev.br/recipes/";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe),
        });

        if (response.ok) {
            alert("Receita salva com sucesso!");
        } else {
            alert("Erro ao salvar receita.");
        }

        setLoading(false);
    };

    const getAllIngredients = async () => {
        const method = "GET";
        const url = "https://api.mikael.dev.br/recipes/get-ingredients";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            const data = await response.json();
            setImgsIngredients(data as Image[]);
        } 
    }

    const saveIngredientImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("path", "ingredients");

    const response = await fetch("https://api.mikael.dev.br/recipes/save-image", {
        method: "POST",
        body: formData,
    });

    if (response.ok) {
        alert("Imagem do ingrediente salva com sucesso!");
        const data = await response.json();
        return data.url
    } else {
        alert("Erro ao salvar imagem do ingrediente.");
    }
}

    
    return {
        recipe,
        loading,
        sessions,
        imgs_ingredients,
        updateField,
        init,
        save,
        getRecipeById,
        setSessions,
        saveIngredientImage
    };
}
