"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import { clearUser } from "../lib/slices/authSlice";
import { logout } from "../../services/authService";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

const Header = ({ username, isAuthenticated }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      toast.success("Logged out successfully");
      router.push("/login");
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(clearUser());
      router.push("/login");
      setShowDropdown(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[50px] bg-[var(--bg-dark)] border-b border-[var(--border-color)] z-50 flex items-center justify-between px-6 max-[640px]:px-4">
      <div className="flex items-center gap-3">
        <Image
          src="/Group.svg"
          alt="Logo"
          width={70}
          height={70}
          className="w-30 h-30"
        />
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated && username ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors p-2 rounded hover:cursor-pointer"
            >
              <div className="w-8 h-8 bg-[rgb(11,176,240)] rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="max-[640px]:hidden">{username}</span>
            
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg py-2">
                <div className=" px-4 py-2 border-b border-[var(--border-color)]">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{username}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Pilot</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left hover:text-red-500 transition-colors text-[var(--text-primary)]"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-white hover:text-gray-300 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;