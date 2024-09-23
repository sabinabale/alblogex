import React from "react";

interface CustomCheckboxProps {
  onChange: (isChecked: boolean) => void;
  checked: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  onChange,
  checked,
}) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={handleToggle}
        />
        <div
          className={`w-5 h-5 border rounded-md flex items-center justify-center transition-colors hover:border-black ${
            checked ? "bg-black border-black" : "border-gray-300"
          }`}
        >
          {checked && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          )}
        </div>
      </div>
    </label>
  );
};

export default CustomCheckbox;
