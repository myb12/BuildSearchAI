'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
}

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch article');
        }

        setArticle(data.article);
      } catch (err: any) {
        console.error('Error fetching article:', err);
        setError(err.message || 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, router]);

  const handleSummarize = async () => {
    if (!article) return;

    setSummarizing(true);
    setSummary('');
    setSummaryError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/articles/${article.id}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ articleBody: article.body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to summarize article');
      }

      setSummary(data.summary);
    } catch (err: any) {
      console.error('Summarization error:', err);
      setSummaryError(err.message || 'Failed to generate summary.');
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4">
          <p className="text-red-500 text-center">{error}</p>
          <div className="mt-4 text-center">
            <Link href="/dashboard/articles" className="text-blue-500 hover:underline">
              Go back to articles
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-4">
          <p className="text-gray-600 text-center">Article not found.</p>
          <div className="mt-4 text-center">
            <Link href="/dashboard/articles" className="text-blue-500 hover:underline">
              Go back to articles
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          {article.tags && article.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{article.body}</p>
          <p className="text-gray-500 text-sm mt-6">Created: {new Date(article.createdAt).toLocaleDateString()} at {new Date(article.createdAt).toLocaleTimeString()}</p>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-3">AI Summary</h2>
            <button
              onClick={handleSummarize}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={summarizing}
            >
              {summarizing ? 'Generating Summary...' : 'Summarize Article'}
            </button>

            {summaryError && <p className="text-red-500 text-sm mt-3">{summaryError}</p>}
            {summary && (
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-800 leading-relaxed">{summary}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Link href="/dashboard/articles" className="text-blue-500 hover:underline">
              &larr; Back to all articles
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}