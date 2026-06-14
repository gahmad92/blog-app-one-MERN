import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[70px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-900">More Blogs</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Home
          </Link>
          
          {user ? (
            <>
              <Link
                to="/create"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50/70"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Write
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-slate-900 text-white px-4 sm:px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}