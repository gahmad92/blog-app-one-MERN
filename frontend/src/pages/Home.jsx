import { useState, useEffect, useCallback } from 'react';
import { getBlogs, deleteBlog } from '../hooks/useBlog';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBlogs(page);
      setBlogs(data.blogs);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
      fetchBlogs();
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
          <div className="h-2 bg-gray-100 rounded w-16" />
        </div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-gray-100 rounded-full w-12" />
        <div className="h-5 bg-gray-100 rounded-full w-16" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section className="mb-10 sm:mb-12 text-center sm:text-left glass-card rounded-3xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            More blogs, ideas, and <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">perspectives</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Discover thoughtful writing from creators around the world. Read, reflect, and find your next great idea.
          </p>
        </section>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl border border-slate-200/70 shadow-sm"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">No stories yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Be the first to share your thoughts with our community.</p>
            {user ? (
              <Link to="/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                Start Writing
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all shadow-md font-medium">
                  Create Account
                </Link>
                <Link to="/login" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-full hover:bg-gray-50 transition-all font-medium">
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/70">
              <p className="text-sm font-medium text-slate-500">
                Showing <span className="text-slate-900">{blogs.length}</span> of <span className="text-slate-900">{total}</span> stories
              </p>
              <div className="text-sm text-slate-400">
                Page {page} of {pages}
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                    className="group bg-white/95 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-5 sm:p-6">
                      <BlogCard
                        blog={blog}
                        onDelete={user?._id === blog.author?._id ? handleDelete : null}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-slate-200/70">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium shadow-sm">
                  {page} / {pages}
                </div>

                <button
                  disabled={page === pages}
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}