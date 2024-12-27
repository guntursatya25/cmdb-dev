import React from 'react';

const Dropdown = ({ label, options = [], selectedOption, onChange, required }) => {
  return (
    <div className="relative my-2">
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
              <select
                id={label}
                value={selectedOption}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="border rounded-md w-full p-2 text-[#374151]"
              >
                <option value="" className='text-gray-400'>---</option>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Dropdown;