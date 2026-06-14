import { Link } from 'react-router-dom';

export default function BlogCard({ blog, onDelete }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const readingTime = (content) => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const colors = [
    'from-pink-100 to-rose-100',
    'from-purple-100 to-indigo-100', 
    'from-amber-100 to-orange-100',
    'from-emerald-100 to-teal-100',
    'from-cyan-100 to-blue-100',
    'from-rose-100 to-pink-100',
  ];
  
  const colorIndex = (blog._id?.charCodeAt(0) || 0) % colors.length;

  return (
    <Link to={`/blog/${blog._id}`} className="block group">
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-semibold">
                {blog.author?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{blog.author?.username}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{formatDate(blog.createdAt)}</span>
                <span className="text-slate-300">·</span>
                <span>{readingTime(blog.content)}</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>
          
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 150)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {blog.tags?.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {tag}
                </span>
              ))}
            </div>
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(blog._id);
                }}
                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-full transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className={`w-20 h-20 flex-shrink-0 rounded-2xl bg-gradient-to-br ${colors[colorIndex]} border border-white shadow-sm flex items-center justify-center overflow-hidden`}>
          <span className="text-2xl">📄</span>
        </div>
      </div>
    </Link>
  );
}