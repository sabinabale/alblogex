import React, { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "w-full border rounded p-2 transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        auth: "border-[rgba(0,0,0,0.2)] hover:border-black focus:border-black focus:outline-2 focus:outline-black focus:outline-offset-2",
        error:
          "border-red-500 hover:border-red-600 focus:border-red-600 focus:outline-2 focus:outline-red-600 focus:outline-offset-2",
        success:
          "border-green-500 hover:border-green-600 focus:border-green-600 focus:outline-2 focus:outline-green-600 focus:outline-offset-2",
      },
    },
    defaultVariants: {
      variant: "auth",
    },
  }
);

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input: React.FC<InputProps> = ({ className, variant, ...props }) => {
  return <input className={inputVariants({ variant, className })} {...props} />;
};

export { Input, inputVariants };
