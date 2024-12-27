import React from 'react';

const TextArea = ({ label, id, name, value, onChange, placeholder, rows, required }) => {
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
              <textarea required={required} type="text" value={value} onChange={onChange} id={id} name={name} rows={rows} className='w-full border rounded-md p-2 text-[#374151]' />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TextArea;
