import React from "react";

type CustomCheckboxProps = {
  onChange: (isChecked: boolean) => void;
  checked: boolean;
  indeterminate?: boolean;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  onChange,
  checked,
  indeterminate = false,
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <label className="cursor-pointer">
      <div>
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={handleToggle}
          ref={checkboxRef}
        />
        <div
          className={`w-[18px] h-[18px] border rounded-md transition-colors hover:border-black ${
            checked || indeterminate
              ? "bg-black border-black"
              : "border-gray-300"
          }`}
        >
          {checked && !indeterminate && (
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
          {indeterminate && (
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
                d="M5 12h14"
              ></path>
            </svg>
          )}
        </div>
      </div>
    </label>
  );
};

export default CustomCheckbox;
