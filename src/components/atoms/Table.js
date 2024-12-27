import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Table = ({ headers, data = [], displayColumns, renderCell, onRowSelect, showCheckbox = true }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (rowIndex) => {
    const updatedSelectedRows = selectedRows.includes(rowIndex)
      ? selectedRows.filter((index) => index !== rowIndex)
      : [...selectedRows, rowIndex];

    setSelectedRows(updatedSelectedRows);

    if (onRowSelect) {
      onRowSelect(updatedSelectedRows);
    }
  };

  return (
    <motion.div className='w-full'
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className='overflow-x-auto'>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              {showCheckbox && (
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const allSelected = isChecked ? data.map((_, index) => index) : [];
                      setSelectedRows(allSelected);
                      if (onRowSelect) {
                        onRowSelect(allSelected);
                      }
                    }}
                    checked={selectedRows.length === data.length && data.length > 0}
                  />
                </th>
              )}
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length + (showCheckbox ? 1 : 0)} className="px-4 py-2 text-center">
                  Data not found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                >
                  {showCheckbox && (
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => handleCheckboxChange(rowIndex)}
                      />
                    </td>
                  )}
                  {displayColumns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      {renderCell ? renderCell(column, row[column], row) : row[column]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Table;
