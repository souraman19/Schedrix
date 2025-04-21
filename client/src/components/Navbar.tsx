'use client';

import { useState } from 'react';
import { Menu, X, Home, ListTodo, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { LOG_OUT_ROUTE } from '@/lib/apiRoutes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUserStore();

  const router = useRouter();

  const handleLogout = async() => {
    try{
      await axios.get(`${LOG_OUT_ROUTE}`, {
        withCredentials: true});
      setUser(null);
      router.push('/'); 
    } catch(error){
      console.error('Error logging out:', error);
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0a0a0a] text-white rounded-full shadow-lg"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <header
        className="fixed top-0 left-0 w-full bg-[hsl(0,0%,5%)] text-white p-4 z-50 
        shadow-[0px_4px_10px_0px_rgba(0,200,83,0.7)]"
      >
        <div className="flex justify-between items-center">
          {/* Logo and Site Name */}
          <h2 className="text-2xl font-bold text-green-400">Schedrix</h2>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8">
            <NavbarLink href="/home" icon={<Home size={20} />}>Home</NavbarLink>
            <NavbarLink href="/tasks" icon={<ListTodo size={20} />}>Tasks</NavbarLink>
            <div onClick={handleLogout}>
                <NavbarLink href={"/"}icon={<LogOut size={20} />} red>Logout</NavbarLink>
            </div>
          </nav>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full bg-[#0d0d0d] text-white p-6 z-50 transition-transform duration-300">
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <NavbarLink href="/home" icon={<Home size={20} />}>Home</NavbarLink>
            <NavbarLink href="/tasks" icon={<ListTodo size={20} />}>Tasks</NavbarLink>
            <NavbarLink href="/logout" icon={<LogOut size={20} />} red>Logout</NavbarLink>
          </nav>
        </div>
      )}
    </>
  );
}

function NavbarLink({ href, icon, children, red = false }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base transition-all
        ${red
          ? 'bg-gradient-to-r from-[#f44336] to-[#e57373] hover:from-[#e53935] hover:to-[#f8bbd0] shadow-md text-white font-semibold'
          : 'hover:bg-[#1e1e1e]'
        }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
