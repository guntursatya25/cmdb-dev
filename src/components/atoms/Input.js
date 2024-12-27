import React from 'react';

const Input = ({ label, type = "text", value, onChange, placeholder, disabled, required, name }) => {
  return (
    <div className="my-2">
      <table className="w-full">
        <tbody>
          <tr>
            <td className="w-2/6 pr-4 text-left align-middle">
            <label htmlFor={label} className="block text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </td>
            <td className="w-4/6">
              <input
                type={type}
                id={label}
                disabled={disabled}
                value={value}
                required = {required}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                className={`border rounded-md w-full p-2 text-[#374151] ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Input;
