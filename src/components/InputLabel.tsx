import React from "react";

type InputLabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
};

export default function InputLabel({ children, htmlFor }: InputLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] mb-1 ml-1 block text-black/60 font-normal"
    >
      {children}
    </label>
  );
}
