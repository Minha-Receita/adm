"use client";

import React, { useEffect, useState } from "react";
import { useRecipeViewModel } from "../controller/recipe_controller";

interface ImageSearchProps {
  dafaultImages?: Image[];
  onImageSelected: (imageUrl: string) => void;
  title?: string;
  initialSearchTerm?: string;
}

const ImageSearch: React.FC<ImageSearchProps> = ({
  dafaultImages = [],
  onImageSelected,
  title = "Buscar Imagem",
  initialSearchTerm = "",
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [defaultImagesSearch, setdefaultImagesSearch] = useState([] as Image[]);
  const [loadingImageId, setLoadingImageId] = useState<string | null>(null);
  const {
    saveIngredientImage,
  } = useRecipeViewModel();
  const handleSearch = async (term?: string) => {
    const query = term || searchTerm;
    if (!query) return;

    try {
      const response = await fetch(
        `/api/freepik-search?term=${encodeURIComponent(query + " transparent background")}`
      );
      const data = await response.json();
      const urls = data?.data?.map((r: any) => r.image.source.url) ?? [];

      const result = dafaultImages.filter(
        (img): img is Image =>
          !!img.name?.toLowerCase().includes(query.toLowerCase())
      );

      setdefaultImagesSearch(result);
      setImages([...urls]);
    } catch (error) {
      console.error("Erro ao buscar imagens", error);
    }
  };


  const handleSelectDefaltImage = (imageUrl: string) => {
    onImageSelected(imageUrl);
    setImages([]);
    setdefaultImagesSearch([]);
  };
  const handleSelectImage = async (imageUrl: string) => {
    setLoadingImageId(imageUrl);
    try {
      const res = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();

      if (data?.image) {
        const file = await fetch(data.image);
        const blob = await file.blob();
        const image = new File([blob], `${searchTerm}.png`, { type: "image/png" });
        const url = await saveIngredientImage(image);
        onImageSelected(url);
      } else {
        console.warn("Fundo não removido. Usando imagem original.");
        onImageSelected(imageUrl);
      }

      setImages([]);
    } catch (error) {
      console.error("Erro ao remover fundo", error);
      onImageSelected(imageUrl);
    } finally {
      setLoadingImageId(null);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite um termo de busca..."
          className="flex-1 border p-2 rounded"
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Procurar
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">Banco de dados (pegue daqui se encontrar)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {defaultImagesSearch.map((img: Image) => (
          <div
            key={img.name}
            className="relative w-[150px] h-[150px] rounded overflow-hidden cursor-pointer bg-transparent border"
            onClick={() => handleSelectDefaltImage(img.url)}
          >
            {loadingImageId === img.name && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
                <span className="text-sm text-gray-600">Removendo fundo...</span>
              </div>
            )}
            <img
              src={img.url}
              alt={"imagem"}
              className="w-full h-full object-contain"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        ))}
      </div>

      <div className="border-t my-4"></div>
      <h2 className="text-xl font-bold mb-4">Imagens encontradas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url: string) => (
          <div
            key={url}
            className="relative w-[150px] h-[150px] rounded overflow-hidden cursor-pointer bg-transparent border"
            onClick={() => handleSelectImage(url)}
          >
            {loadingImageId === url && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
                <span className="text-sm text-gray-600">Removendo fundo...</span>
              </div>
            )}
            <img
              src={url}
              alt={"imagem"}
              className="w-full h-full object-contain"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;
