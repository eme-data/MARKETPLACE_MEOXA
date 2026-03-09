import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-meoxa-orange hover:bg-meoxa-orange-hover text-white focus:ring-meoxa-orange",
      secondary:
        "bg-meoxa-blue hover:bg-meoxa-blue-light text-white focus:ring-meoxa-blue",
      outline:
        "border-2 border-meoxa-blue text-meoxa-blue hover:bg-meoxa-blue hover:text-white focus:ring-meoxa-blue",
      ghost:
        "text-meoxa-blue hover:bg-meoxa-gray focus:ring-meoxa-blue",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
