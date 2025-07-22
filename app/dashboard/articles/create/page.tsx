'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function CreateArticlePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body, tags: tagsArray }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create article');
      }

      alert('Article created successfully!');
      router.push('/dashboard/articles'); 
    } catch (err: any) {
      console.error('Create article error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">
              Content:
            </label>
            <textarea
              id="body"
              rows={10}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
              Tags (comma-separated):
            </label>
            <input
              type="text"
              id="tags"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., programming,nextjs,ai"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Article'}
            </button>
            <Link href="/dashboard/articles" className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}