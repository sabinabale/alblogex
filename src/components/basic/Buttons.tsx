import * as React from "react";
import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@/components/basic/Slot";

const buttonVariants = cva(
  "inline-flex w-fit items-center justify-center whitespace-nowrap rounded-md flex-shrink-0 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        primary: "bg-black/90 text-white w-full hover:bg-[#333333] w-fit",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        link: "text-cyan-600 underline underline-offset-2 hover:text-cyan-500",
        icon: "bg-none border-none hover:opacity-40",
      },
      size: {
        default: "py-1.5 px-3",
        none: "p-0",
        small: "py-1 px-2",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
