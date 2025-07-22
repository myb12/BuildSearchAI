'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header'; 

interface User {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        router.push('/login'); 
      }
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard, {user.email}!</h1>
        <p className="text-lg">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis a voluptatem, eius suscipit, iure expedita dolorum voluptates nihil repellendus repudiandae quisquam vero laudantium sint, accusamus beatae. Tenetur sapiente numquam distinctio, sequi vel illum obcaecati odit perspiciatis? Illum excepturi corrupti doloremque. Perspiciatis, deserunt rerum. Amet quae dolorum nostrum corrupti ipsum quidem neque? Quod, est, sequi fugiat ipsa iusto, laborum rem animi quidem tempora esse iste culpa explicabo doloremque facere aspernatur possimus recusandae. Voluptate fugit iusto sapiente accusantium fugiat deserunt cum repellendus saepe commodi quam. Dolor accusantium at eaque officia! Ad, eaque voluptas. Iste voluptatum quae voluptatem omnis molestiae vel illum a.</p>
      </main>
    </div>
  );
}