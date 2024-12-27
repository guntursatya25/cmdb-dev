import { FiSearch } from "react-icons/fi";

export default function SearchInput({ value, onChange, onKeyDown }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md bg-white p-1 w-full max-w-md">
      <FiSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown} 
        placeholder="Search..."
        className="w-full border-none outline-none focus:ring-0"
      />
    </div>
  );
}
