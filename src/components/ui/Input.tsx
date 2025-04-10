import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className = "", fullWidth = true, helperText, ...props },
    ref
  ) => {
    const baseInputClasses =
      "py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm";
    const errorInputClasses =
      "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-md">
          <input
            ref={ref}
            className={`${baseInputClasses} ${error ? errorInputClasses : ""} ${
              fullWidth ? "w-full" : ""
            } ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
