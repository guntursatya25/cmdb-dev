import { useState } from "react";
import Link from "next/link";

export default function DropdownMenu({ menus = [] }) {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (index) => {
        setOpenMenu(openMenu === index ? null : index);
    };

    return (
        <div>
            {menus.map((menu, index) => (
                <div key={index} className="flex flex-col overflow-hidden">
                    <button
                        onClick={() => toggleMenu(index)}
                        className={`w-full flex justify-between items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left hover:bg-gray-50 ${openMenu === index ? "font-bold" : "font-normal"
                            }`}
                    >
                        {menu.title}
                        <span>{openMenu === index ? "-" : "+"}</span>
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden`}
                        style={{
                            maxHeight: openMenu === index ? "500px" : "0px",
                        }}
                    >
                        <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                            {menu.items.map((item, idx) => (
                                <li key={idx} className="border-b last:border-b-0">
                                    {item.href ? (
                                        <Link href={item.href} className="block px-4 py-2 hover:bg-gray-100">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="block px-4 py-2 text-gray-500">
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}
