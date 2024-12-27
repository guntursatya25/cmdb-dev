import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { TbLayoutDashboard, TbDeviceDesktopCog, TbUsersGroup } from "react-icons/tb";
import { FaBox } from "react-icons/fa";
import { IoMdDocument } from "react-icons/io";
import { MdKeyboardArrowRight, MdMenu } from "react-icons/md";
import { useState, useEffect } from "react";
import { useSidebarContext } from "@/config/context";
import { getCookie } from "cookies-next";

export default function Sidebar({ show, setter }) {
    const router = useRouter();
    const {activeMenu, activeSubmenu, changeActiveMenu, changeActiveSubmenu } = useSidebarContext();
    const [isAssetsOpen, setIsAssetsOpen] = useState(false);
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSetupCollapsed, setIsSetupCollapsed] = useState(false);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const idUser = localStorage.getItem("userId");
        if (storedUsername) {
            setUsername(JSON.parse(storedUsername));
        }
        if (storedRole) {
            setRole(JSON.parse(storedRole));
        }
        fetchData(idUser);
    }, []);

    const fetchData = async (id) => {
        setLoading(true);
        const token = getCookie("access_token");
        try {
            const response = await axios.get(`${process.env.base_url}/users/myprofile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const className = isCollapsed
    ? "bg-[#003b71] w-[80px] transition-all duration-500 fixed top-0 left-0 z-0 h-screen"
    : "bg-[#003b71] w-[250px] transition-all duration-500 fixed top-0 left-0 z-0 h-screen";

const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

    useEffect(() => {
        if (router.pathname.startsWith("/assets")) {
            changeActiveMenu("/assets");
            changeActiveSubmenu(router.pathname);
            setIsAssetsOpen(true);
        }if (router.pathname.startsWith("/setup")) {
            changeActiveMenu("/setup");
            changeActiveSubmenu(router.pathname);
            setIsSetupOpen(true);
        } else {
            changeActiveMenu(router.pathname);
            setIsAssetsOpen(false);
        }
    }, [router.pathname]);

    const handleAssetsClick = () => {
        setIsAssetsOpen(!isAssetsOpen);
        changeActiveMenu("/assets");
    };

    const handleSetupClick = () => {
        setIsSetupOpen(!isSetupOpen);
        changeActiveMenu("/assets");
    };

    const MenuItem = ({ icon, name, route, isSubmenu = false }) => {
        const isActive = isSubmenu ? activeSubmenu === route : activeMenu === route;
        const colorClass = isSubmenu
            ? isActive
                ? "text-yellow-500 font-bold"
                : "text-white hover:text-white"
            : isActive
            ? "text-white font-bold"
            : "text-white hover:text-white";
    
        return (
            <Link
                href={route}
                onClick={() => {
                    if (isSubmenu) {
                        changeActiveSubmenu(route); 
                    } else {
                        changeActiveMenu(route);
                        changeActiveSubmenu(null);
                    }
                    setter((oldVal) => !oldVal);
                }}
                className={`flex gap-1 items-center text-md px-4 py-2 border-b-[1px] border-b-white/10 ${colorClass}`}
            >
                <div className="text-xl flex w-[30px] justify-start">{icon}</div>
                {!isCollapsed && <div>{name}</div>}
            </Link>
        );
    };
    

    const ModalOverlay = () => (
        <div
            className="flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-[#dadbdc]/50 z-30 h-screen pb-4 "
            onClick={() => setter((oldVal) => !oldVal)}
        />
    );

    return (
        <>
              <div className={`${className}${appendClass} shadow-lg flex flex-col justify-between overflow-hidden`}>
              <div className="btnnn w-full p-4 flex items-center" >
                    {!isCollapsed && (
                        <Link href="/">
                            <Image src="/images/logo-peruri.png" alt="Company Logo" width={150} height={150} />
                        </Link>
                    )}
                    {/* <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-2xl focus:outline-none">
                        {isCollapsed ? <MdMenu /> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="gray" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12z" /></svg>}
                    </button> */}
                </div>
                <div className="flex-grow overflow-y-auto scroll-container">
                    <div className="flex flex-col pt-3 overflow-y-auto">
                        <MenuItem name="Dashboard" route="/coba" icon={<TbLayoutDashboard />} />
                        <div className={`flex flex-col ${isAssetsOpen ? "pb-2" : ""}`}>
                            <div
                                onClick={handleAssetsClick}
                                className={`flex gap-1 items-center cursor-pointer px-4 py-3 border-b-[1px] border-b-white/10 ${activeMenu === "/assets" ? "bg-slate-50 font-bold" : "text-white hover:text-white"
                                    }`}
                            >
                                <div className="text-xl flex w-[30px]">
                                    <FaBox />
                                </div>
                                {!isCollapsed && (
                                    <div className="flex justify-between w-full items-center">
                                        <span>Assets</span>
                                        <MdKeyboardArrowRight
                                            className={`transform transition-transform ${isAssetsOpen ? "rotate-90" : ""}`}
                                        />
                                    </div>
                                )}
                            </div>
                            {isAssetsOpen && !isCollapsed && (
                                <div className="pl-10">
                                    <MenuItem
                                        name="Software"
                                        route="/assets/software"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M10 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0" /><path d="M18.245 15a8 8 0 1 0-12.49 0M3 18.5c0-1.404 0-2.107.303-2.611c.132-.218.3-.406.497-.552C4.254 15 4.886 15 6.15 15h11.7c1.264 0 1.896 0 2.35.337c.197.146.365.334.497.552c.303.504.303 1.207.303 2.611s0 2.107-.303 2.611c-.132.218-.3.406-.497.552c-.454.337-1.086.337-2.35.337H6.15c-1.264 0-1.896 0-2.35-.337a1.9 1.9 0 0 1-.497-.552C3 20.607 3 19.904 3 18.5m8-.5h2m2.89-11.39l2.012-2.01" /></g></svg>}
                                    />
                                    <MenuItem
                                        name="Hardware"
                                        route="/assets/hardware"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="M20.54 9.984v4.123a.69.69 0 0 1-.356.644l-7.13 4.024a2.1 2.1 0 0 1-2.057.003L3.82 14.752a.69.69 0 0 1-.355-.659V9.998a.69.69 0 0 1 .345-.653l7.156-4.172a2.1 2.1 0 0 1 2.117.003l7.112 4.17a.69.69 0 0 1 .344.638Z" /><path d="M3.82 10.558a.699.699 0 0 1-.01-1.213l7.157-4.172a2.1 2.1 0 0 1 2.116.003l7.112 4.17a.699.699 0 0 1-.01 1.212l-7.132 4.023a2.1 2.1 0 0 1-2.056.003z" /></g></svg>}
                                    />
                                    <MenuItem
                                        name="License"
                                        route="/assets/licenses"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 2.5A21.5 21.5 0 1 0 45.5 24A21.51 21.51 0 0 0 24 2.5m0 9.77a11.73 11.73 0 0 0-11.45 9.29h5.59a6.35 6.35 0 1 1 0 4.88h-5.6A11.72 11.72 0 1 0 24 12.27" /></svg>}
                                    />
                                </div>
                            )}
                        </div>
                        <MenuItem name="Documents" route="/documents" icon={<IoMdDocument />} />
                        <MenuItem
                            name="User Management"
                            route="/users"
                            icon={<TbUsersGroup />}
                        />
                          <MenuItem
                            name="Problem"
                            route="/problem-management"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5.99L19.53 19H4.47zM12 2L1 21h22zm1 14h-2v2h2zm0-6h-2v4h2z"/></svg>}
                        />
                           <MenuItem
                            name="Incident"
                            route="/incidents"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M2.5 12.25a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H4a1.5 1.5 0 0 0-1.5 1.5zm1.5 3a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3zM9 11a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25-5.75a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0z" clip-rule="evenodd"/></svg>}
                        />
                        <div className={`flex flex-col ${isSetupOpen ? "pb-2" : ""}`}>
                            <div
                                onClick={handleSetupClick}
                                className={`flex gap-1 items-center cursor-pointer px-4 py-3 border-b-[1px] border-b-white/10 ${activeMenu === "/setup" ? "bg-slate-50 font-bold" : "text-white hover:text-white"
                                    }`}
                            >
                                <div className="text-xl flex w-[30px]">
                                    <FaBox />
                                </div>
                                {!isSetupCollapsed && (
                                    <div className="flex justify-between w-full items-center">
                                        <span>Setup</span>
                                        <MdKeyboardArrowRight
                                            className={`transform transition-transform ${isSetupOpen ? "rotate-90" : ""}`}
                                        />
                                    </div>
                                )}
                            </div>
                            {isSetupOpen && !isSetupCollapsed && (
                                <div className="pl-10">
                                    <MenuItem
                                        name="Categories"
                                        route="/setup/categories"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M10 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0" /><path d="M18.245 15a8 8 0 1 0-12.49 0M3 18.5c0-1.404 0-2.107.303-2.611c.132-.218.3-.406.497-.552C4.254 15 4.886 15 6.15 15h11.7c1.264 0 1.896 0 2.35.337c.197.146.365.334.497.552c.303.504.303 1.207.303 2.611s0 2.107-.303 2.611c-.132.218-.3.406-.497.552c-.454.337-1.086.337-2.35.337H6.15c-1.264 0-1.896 0-2.35-.337a1.9 1.9 0 0 1-.497-.552C3 20.607 3 19.904 3 18.5m8-.5h2m2.89-11.39l2.012-2.01" /></g></svg>}
                                    />
                                    <MenuItem
                                        name="Item Type"
                                        route="/setup/item-type"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="M20.54 9.984v4.123a.69.69 0 0 1-.356.644l-7.13 4.024a2.1 2.1 0 0 1-2.057.003L3.82 14.752a.69.69 0 0 1-.355-.659V9.998a.69.69 0 0 1 .345-.653l7.156-4.172a2.1 2.1 0 0 1 2.117.003l7.112 4.17a.69.69 0 0 1 .344.638Z" /><path d="M3.82 10.558a.699.699 0 0 1-.01-1.213l7.157-4.172a2.1 2.1 0 0 1 2.116.003l7.112 4.17a.699.699 0 0 1-.01 1.212l-7.132 4.023a2.1 2.1 0 0 1-2.056.003z" /></g></svg>}
                                    />
                                    <MenuItem
                                        name="Manufacturer"
                                        route="/setup/manufacturer"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 2.5A21.5 21.5 0 1 0 45.5 24A21.51 21.51 0 0 0 24 2.5m0 9.77a11.73 11.73 0 0 0-11.45 9.29h5.59a6.35 6.35 0 1 1 0 4.88h-5.6A11.72 11.72 0 1 0 24 12.27" /></svg>}
                                    />
                                     <MenuItem
                                        name="Model"
                                        route="/setup/model"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 2.5A21.5 21.5 0 1 0 45.5 24A21.51 21.51 0 0 0 24 2.5m0 9.77a11.73 11.73 0 0 0-11.45 9.29h5.59a6.35 6.35 0 1 1 0 4.88h-5.6A11.72 11.72 0 1 0 24 12.27" /></svg>}
                                    />
                                     <MenuItem
                                        name="Status"
                                        route="/setup/status"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 2.5A21.5 21.5 0 1 0 45.5 24A21.51 21.51 0 0 0 24 2.5m0 9.77a11.73 11.73 0 0 0-11.45 9.29h5.59a6.35 6.35 0 1 1 0 4.88h-5.6A11.72 11.72 0 1 0 24 12.27" /></svg>}
                                    />
                                </div>
                            )}
                        </div>
                        <MenuItem name="Logs" route="/logs" icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 12h8m-8 6h8M13 6h8M3 12h1m-1 6h1M3 6h1m4 6h1m-1 6h1M8 6h1" /></svg>} />
                        <MenuItem name="Announcement" route="/announcement" icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M15.992 3.013C17.326 2.236 19 3.197 19 4.741V8a3 3 0 1 1 0 6v3c0 1.648-1.881 2.589-3.2 1.6l-2.06-1.546A8.66 8.66 0 0 0 10 15.446v2.844a2.71 2.71 0 0 1-5.316.744l-1.57-5.496a4.7 4.7 0 0 1 3.326-7.73l3.018-.168a9.34 9.34 0 0 0 4.19-1.259zM5.634 15.078l.973 3.407A.71.71 0 0 0 8 18.29v-3.01l-1.56-.087a5 5 0 0 1-.806-.115M20 11a1 1 0 0 0-1-1v2a1 1 0 0 0 1-1" /></g></svg>} />
                        {/* <div className={`flex flex-col ${isAssetsOpen ? "pb-2" : ""}`}>
                            <div
                                onClick={handleAssetsClick}
                                className={`flex gap-1 items-center cursor-pointer px-4 py-3 border-b-[1px] border-b-white/10 ${activeMenu === "/assets" ? "bg-slate-50 font-bold" : "text-white hover:text-white"
                                    }`}
                            >
                                <div className="text-xl flex w-[30px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="m17.458 9.08l-.291-.514c-.22-.389-.33-.583-.518-.66c-.187-.078-.399-.017-.822.106l-.72.206a1.16 1.16 0 0 1-.801-.102L14.107 8a1.2 1.2 0 0 1-.465-.581l-.197-.598c-.129-.396-.194-.594-.348-.708S12.738 6 12.33 6h-.658c-.41 0-.614 0-.768.113c-.154.114-.219.312-.348.708l-.197.598a1.2 1.2 0 0 1-.465.58l-.199.117c-.247.13-.53.165-.801.102l-.72-.206c-.423-.123-.635-.184-.822-.106c-.188.077-.298.271-.518.66l-.291.514c-.206.364-.31.547-.29.74c.02.194.159.35.435.663l.608.692c.149.191.254.525.254.825s-.105.633-.254.825l-.608.692h0c-.276.312-.415.468-.435.662s.084.377.29.74l.291.515c.22.388.33.583.518.66c.187.078.399.017.822-.106l.72-.206a1.16 1.16 0 0 1 .801.102l.199.116c.212.138.374.342.465.581l.197.599c.129.396.194.593.348.707s.359.113.768.113h.658c.41 0 .614 0 .768-.113c.154-.114.219-.311.348-.707l.197-.599c.09-.24.253-.443.465-.58l.199-.117c.247-.13.53-.165.801-.102l.72.206c.423.123.635.184.822.106c.188-.077.298-.272.518-.66h0l.291-.514c.206-.364.31-.547.29-.74c-.02-.195-.159-.35-.435-.663l-.608-.692c-.149-.191-.254-.525-.254-.825s.105-.634.254-.825l.608-.692c.276-.312.415-.469.434-.662s-.083-.377-.289-.74" /><circle cx="12" cy="12" r="1.75" /><path d="M19 2v2.859A9.97 9.97 0 0 0 12 2C6.477 2 2 6.477 2 12a10 10 0 0 0 .832 4M5 22v-2.859A9.97 9.97 0 0 0 12 22c5.523 0 10-4.477 10-10a10 10 0 0 0-.832-4" /></g></svg>
                                </div>
                                {!isCollapsed && (
                                    <div className="flex justify-between w-full items-center">
                                        <span>Setup</span>
                                        <MdKeyboardArrowRight
                                            className={`transform transition-transform ${isAssetsOpen ? "rotate-90" : ""}`}
                                        />
                                    </div>
                                )}
                            </div>
                            {isSetupOpen && !isSetupCollapsed && (
                                <div className="pl-10">
                                    <MenuItem
                                        name="Categories"
                                        route="/setup/categories"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M10 10a2 2 0 1 0 4 0a2 2 0 0 0-4 0" /><path d="M18.245 15a8 8 0 1 0-12.49 0M3 18.5c0-1.404 0-2.107.303-2.611c.132-.218.3-.406.497-.552C4.254 15 4.886 15 6.15 15h11.7c1.264 0 1.896 0 2.35.337c.197.146.365.334.497.552c.303.504.303 1.207.303 2.611s0 2.107-.303 2.611c-.132.218-.3.406-.497.552c-.454.337-1.086.337-2.35.337H6.15c-1.264 0-1.896 0-2.35-.337a1.9 1.9 0 0 1-.497-.552C3 20.607 3 19.904 3 18.5m8-.5h2m2.89-11.39l2.012-2.01" /></g></svg>}
                                    />
                                    <MenuItem
                                        name="Item Type"
                                        route="/setup/item-type"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="M20.54 9.984v4.123a.69.69 0 0 1-.356.644l-7.13 4.024a2.1 2.1 0 0 1-2.057.003L3.82 14.752a.69.69 0 0 1-.355-.659V9.998a.69.69 0 0 1 .345-.653l7.156-4.172a2.1 2.1 0 0 1 2.117.003l7.112 4.17a.69.69 0 0 1 .344.638Z" /><path d="M3.82 10.558a.699.699 0 0 1-.01-1.213l7.157-4.172a2.1 2.1 0 0 1 2.116.003l7.112 4.17a.699.699 0 0 1-.01 1.212l-7.132 4.023a2.1 2.1 0 0 1-2.056.003z" /></g></svg>}
                                    />
                                    <MenuItem
                                        name="License"
                                        route="/licenses"
                                        isSubmenu
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 2.5A21.5 21.5 0 1 0 45.5 24A21.51 21.51 0 0 0 24 2.5m0 9.77a11.73 11.73 0 0 0-11.45 9.29h5.59a6.35 6.35 0 1 1 0 4.88h-5.6A11.72 11.72 0 1 0 24 12.27" /></svg>}
                                    />
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
                <div>
                    <Link href="/" className="flex py-4 items-center px-3 text-xs gap-4 shadow-lg text-white">
                        {data.image ? (
                            <Image
                                src={`${process.env.base_url}/users${data.image}`}
                                alt="User Profile"
                                width={30}
                                height={30}
                                className="rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = "/images/pngwing.com.png";
                                }}
                            />
                        ) : (
                            <Image
                                src="/images/pngwing.com.png"
                                alt="Default Profile"
                                width={30}
                                height={30}
                                className="rounded-full object-cover"
                            />
                        )}
                        <div>
                            <p className="font-bold">{username || "Not available"}</p>
                            <p>{role || "Not available"}</p>
                        </div>
                    </Link>
                </div>
            </div>
            {show ? <ModalOverlay /> : null}
        </>
    );
}



// bg-[#dadbdc]