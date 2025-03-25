interface Option {
    label: string;
    value: string | number;
  }
  
  interface SelectFieldProps {
    label: string;
    options: Option[];
    value: string | number | null;
    onChange: (value: string | number) => void;
    placeholder?: string;
  }
  
  export default function SelectField({
    label,
    options,
    value,
    onChange,
    placeholder = "Selecione uma opção",
  }: SelectFieldProps) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  