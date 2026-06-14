import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      </div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/70 bg-white/70 backdrop-blur-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700">More Blogs</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} More Blogs. Read. Write. Grow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}