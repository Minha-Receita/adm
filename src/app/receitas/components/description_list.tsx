import React, { useEffect } from "react";
import ImageSearchModal from "./select_imag";
import { useRecipeViewModel } from "../controller/recipe_controller";

interface GenericItem {
  step?: number;
  description?: string;
  title?: string;
  quantity?: number;
}

interface GenericListProps {
  dafaultImages: Image[];
  items: GenericItem[];
  setItems: (items: GenericItem[]) => void;
  label: string;
  itemLabelPrefix: string;
  withSelectImage?: boolean;
  withQuantity?: boolean;
}

const GenericList: React.FC<GenericListProps> = ({
  dafaultImages,
  items,
  setItems,
  label,
  itemLabelPrefix,
  withSelectImage = false,
  withQuantity = false,
}) => {
  const handleAddItem = (index: number) => {
    const item = { step: index + 1, description: "", title: "", quantity: 1 };
    setItems([...items, item]);
  };
  const {
    saveIngredientImage,
  } = useRecipeViewModel();
  const handleUpdateItem = (index: number, field: keyof GenericItem, value: string | number) => {
    const updated = [...items];
  
    updated[index] = {
      ...updated[index],
      [field]: value,
      step: index + 1 // Atualiza o step com base na posição
    };
  
    setItems(updated);
  };

  const handleRemoveItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));
 
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border p-4 space-y-2 rounded-lg">
            {withSelectImage && item.title && (
              <div className="w-full h-50 flex justify-center mt-4 p-2 bg-gray-100 border border-gray-300 rounded-lg">
                <img
                  src={item.title}
                  alt="Preview"
                  className="w-full h-50 object-contain rounded-md shadow-md"
                />
              </div>
            )}

            {withSelectImage && (
              <ImageSearchModal
                dafaultImages={dafaultImages}
                onImageSelected={(imageUrl) =>
                  handleUpdateItem(index, "title", imageUrl)
                }
                initialSearchTerm={item.description}
                title="Buscar Imagem"
              />

            )}
            <div className="flex justify-between">
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={item.title}
              onChange={(e) =>
                handleUpdateItem(index, "title", e.target.value)
              }
              placeholder="URL da Imagem"
            />
            <button
              type="button"
              className="text-blue-600"
              onClick={async () => {
                if (item.title) {
                  const file = await fetch(item.title).then((r) => r.blob());
                  const image = new File([file], `${item.title}.png`, {
                    type: "image/png",
                  });
                  const url = await saveIngredientImage(image);
                  handleUpdateItem(index, "title", url);
                }
              }}
            >
              salvar
            </button>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">
                {itemLabelPrefix} {index + 1}
              </span>
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleRemoveItem(index)}
              >
                🗑️
              </button>
            </div>

            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              value={item.description}
              onChange={(e) =>
                handleUpdateItem(index, "description", e.target.value)
              }
            />

            {withQuantity && (
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
                value={item.quantity || ""}
                onChange={(e) =>
                  handleUpdateItem(index, "description", e.target.value)
                }
                placeholder="Quantidade"
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600"
          onClick={() => handleAddItem(items.length)}
        >
          + Adicionar {itemLabelPrefix}
        </button>
      </div>
    </div>
  );
};

export default GenericList;
