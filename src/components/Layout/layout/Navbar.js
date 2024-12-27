import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 5, text: 'Login', href: '/login' },
  ];

  return (
    <div className='bg-white shadow-md flex justify-between items-center h-16 w-full px-4 text-white sticky top-0 z-50'>
      <Image src="/images/LOGO.svg" alt="Company Logo" width={80} height={80} />

      <ul className='hidden md:flex text-black'>
        {navItems.map(item => (
          <Link
            key={item.id} href={item.href}
            className='p-4 hover:bg-[#003b71] rounded-xl m-2 cursor-pointer duration-300 hover:text-white'
          >
            {item.text}
          </Link>
        ))}
      </ul>

      {/* Mobile */}
      <div onClick={handleNav} className='block md:hidden text-black'>
        {nav ? <AiOutlineClose size={20} color='black' /> : <AiOutlineMenu size={20} />}
      </div>

      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[50%] h-full border-r bg-white shadow-md ease-in-out duration-500'
            : 'ease-in-out w-[50%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        <Image className='m-4' src="/images/LOGO.svg" alt="Company Logo" width={80} height={80} />

        {navItems.map(item => (
          <Link
            key={item.id} href={item.href}
            className='p-4 text-black hover:bg-[#003b71] duration-300 hover:text-white cursor-pointer border-gray-600 w-full'
          >
            {item.text}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
