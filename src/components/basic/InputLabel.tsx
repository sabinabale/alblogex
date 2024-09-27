import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const labelVariants = cva("block text-[13px] mb-1 ml-1 font-normal", {
  variants: {
    variant: {
      auth: "text-black/60",
      article: "text-black/60",
    },
  },
  defaultVariants: {
    variant: "auth",
  },
});

type InputLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof labelVariants> & {
    children: React.ReactNode;
  };

export default function InputLabel({
  children,
  variant,

  className,
  ...props
}: InputLabelProps) {
  return (
    <label className={labelVariants({ variant, className })} {...props}>
      {children}
    </label>
  );
}

export { InputLabel, labelVariants };
