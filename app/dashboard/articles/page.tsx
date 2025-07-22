// app/dashboard/articles/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

interface Article {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const router = useRouter();

  const fetchArticles = useCallback(async (
      query: string = '',
      tags: string = ''
    ) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const params = new URLSearchParams();
      if (query) {
        params.append('query', query);
      }
      if (tags) {
        params.append('tags', tags);
      }

      const response = await fetch(`/api/articles?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch articles');
      }

      setArticles(data.articles);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'Failed to load articles.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchArticles(searchQuery, tagFilter);
  }, [fetchArticles]);

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete article');
      }

      setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
      alert('Article deleted successfully!');

    } catch (err: any) {
      console.error('Error deleting article:', err);
      setError(err.message || 'Failed to delete article.');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTagFilter('');
    fetchArticles('', ''); 
  };


  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Articles</h1>
          <Link href="/dashboard/articles/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create New Article
          </Link>
        </div>


        <div className="mb-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-3">Filter Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
                Keyword in Title/Body:
              </label>
              <input
                type="text"
                id="search"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Search by keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
                Filter by Tags (comma-separated):
              </label>
              <input
                type="text"
                id="tags"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., react,nextjs"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => fetchArticles(searchQuery, tagFilter)}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            >
              Apply Filters
            </button>
          
            {(searchQuery || tagFilter) && (
              <button
                onClick={handleClearFilters}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>


        {loading && <p className="text-center text-gray-600">Loading articles...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && articles.length === 0 && !error && (
          <p className="text-center text-gray-600">No articles found. Start by creating one!</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-xl font-semibold mb-2 text-blue-800">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.body}</p>
                {article.tags && article.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {tag}
                        </span>
                    ))}
                    </div>
                )}
                <p className="text-gray-500 text-xs mt-2">Created: {new Date(article.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 flex space-x-2">
                    <Link href={`/dashboard/articles/${article.id}`} className="bg-green-500 hover:bg-green-700 text-white text-sm px-3 py-1 rounded">
                    View / Summarize
                    </Link>
                    <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded cursor-pointer"
                    >
                    Delete
                    </button>
                </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}