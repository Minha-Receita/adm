import React, { ChangeEventHandler, useState } from 'react';
interface RecipeTextFieldInputProps {
    title: string;
    value: string | undefined;
    placeholder?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    type?: string;
  }
function RecipeTextFieldInput(props:RecipeTextFieldInputProps) {

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
            {props.title}
            </label>
            <input
                type={props.type || "text"}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

export default RecipeTextFieldInput;
