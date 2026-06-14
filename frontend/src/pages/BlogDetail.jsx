import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlog, deleteBlog } from '../hooks/useBlog';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      const data = await getBlog(id);
      setBlog(data);
    } catch (err) {
      console.error(err);
      navigate('/');
    }
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlog();
  }, [fetchBlog]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      await deleteBlog(id);
      navigate('/');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const readingTime = (content) => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  const isAuthor = user?._id === blog.author?._id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-10 glass-card rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag, i) => (
              <span key={i} className="text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {blog.title}
          </h1>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {blog.author?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{blog.author?.username}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{formatDate(blog.createdAt)}</span>
                <span className="text-slate-300">·</span>
                <span>{readingTime(blog.content)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-lg max-w-none mb-12 pb-12 border-b border-slate-200">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {isAuthor && (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/edit/${blog._id}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      <div className="mt-10">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </motion.article>
  );
}