import type { TextInputProps } from "../interfaces/formsInterface";

const TextInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hidden = false,
} : TextInputProps) => {
  if (hidden) return <input type={type} name={name} value={value} hidden />;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default TextInput;
