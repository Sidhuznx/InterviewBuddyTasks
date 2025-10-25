import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

export function FormTextArea({ label, error, rows = 3, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        rows={rows}
        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function FormSelect({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`w-full px-4 py-2.5 bg-white dark:bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
