"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { adminMenuItems, studentMenuItems, teacherMenuItems } from "../constants/menuItems";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import { toggleSidebar } from "@/store/slices/sidebar.slice";

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const role = user?.role?.toLowerCase();

  let menuItems = studentMenuItems;
  if (role === 'admin') menuItems = adminMenuItems;
  if (role === 'teacher') menuItems = teacherMenuItems;

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    router.replace('/login');
  };

  const { isSidebarOpen } = useSelector((state: RootState) => state.sidebar);
  const handleSidebarClose = () => {
    dispatch(toggleSidebar());
  }
 
  return (
    <>
      <div onClick={handleSidebarClose} className={`fixed inset-0 z-40 bg-black/50 transition-opacity w-full md:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}></div>

      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-bgGray flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        <div className="p-6 flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
              ST
          </div>
          <span className="text-xl font-bold text-gray-800">SchoolTrack</span>
        </div>

        <button onClick={handleSidebarClose} className="md:hidden place-self-end px-4 text-gray-500 cursor-pointer">
          <FaTimes className="text-xl" />
        </button>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={handleSidebarClose}
              >
                <item.icon className="text-lg" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-50 rounded-lg transition-colors"
          >
              <FaSignOutAlt />
              <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;