import { Menu, Bell, User, Search, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/frontend/contexts/AuthContext";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700 lg:hidden">
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden md:flex relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-64 rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#186a42] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-sm font-medium text-gray-500 hover:text-gray-700 hidden sm:block"
        >
          View Public Site
        </Link>
        <button className="relative text-gray-400 hover:text-gray-500">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <Link
          to="/admin/account"
          className="flex items-center gap-2 border-l border-gray-200 pl-4 hover:opacity-80 transition-opacity"
          title="Manage My Account"
        >
          {currentUser?.profile_image_url ? (
            <img
              src={currentUser.profile_image_url}
              alt={currentUser.full_name || "Profile"}
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#186a42]/10 flex items-center justify-center text-[#186a42]">
              <User className="h-4 w-4" />
            </div>
          )}
          <div className="hidden text-sm md:flex md:flex-col text-left">
            <p className="font-medium text-gray-700 truncate max-w-[150px]">
              {currentUser?.full_name || currentUser?.email || "Admin User"}
            </p>
            {currentUser?.role_name && (
              <p className="text-xs text-gray-500 capitalize">{currentUser.role_name}</p>
            )}
          </div>
        </Link>
        <button
          onClick={() => logout()}
          className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
