import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null); // Renamed for consistency

    const changeActiveMenu = (menu) => {
        setActiveMenu(menu);
        setActiveSubmenu(null); // Ensure submenu resets when changing the main menu
    };

    const changeActiveSubmenu = (subMenu) => {
        setActiveSubmenu(subMenu); // Consistent naming
    };

    return (
        <SidebarContext.Provider value={{ activeMenu, changeActiveMenu, activeSubmenu, changeActiveSubmenu }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebarContext = () => useContext(SidebarContext);


// import React, { createContext, useState, useEffect } from 'react'
// import { useRouter } from 'next/router'

// export const Context = createContext();

// const ContextProvider = (props) => {
//     const [selectedTab, setSelectedTab] = useState('')
//     const router = useRouter();
//     const pathname = router.pathname
    
//     useEffect(() => {
//         if (pathname === '/' ) {
//             setSelectedTab('Announcement');
//         }
//         else if (pathname === '/documents' || pathname.startsWith('/documents') ) {
//             setSelectedTab('Documents');
//         }
//         else if (pathname === '/licenses' || pathname.startsWith('/licenses')) {
//             setSelectedTab('Licenses');
//         }
//         else if (pathname === '/logs' || pathname.startsWith('/logs')) {
//             setSelectedTab('Logs');
//         }
//         else if (pathname === '/knowledge-base' || pathname.startsWith('/knowledge-base')) {
//             setSelectedTab('Knowledge-base');
//         }
//         else if (pathname === '/setup' || pathname.startsWith('/setup')) {
//             setSelectedTab('Setup');
//         }
//         else if (pathname === '/users' || pathname.startsWith('/users') ) {
//             setSelectedTab('Users');
//         }
//         else {
//             setSelectedTab('')
//         }
//     }, [pathname])


//   return (
//       <Context.Provider 
//           value={{
//               selectedTab, setSelectedTab
//           }}
//       >
//           {props.children}
//       </Context.Provider>
//   );

// }

// export default ContextProvider