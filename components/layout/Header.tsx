'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AI Knowledgebase
        </Link>
        <nav>
          {isLoggedIn ? (
            <ul className="flex space-x-4 items-center">
              <li>
                <span className="text-sm">Welcome, {userName}</span>
              </li>
              <li>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-4">
              <li>
                <Link href="/login" className="hover:underline">Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline">Register</Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}