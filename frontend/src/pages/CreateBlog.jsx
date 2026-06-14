import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBlog } from '../hooks/useBlog';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

// 🔧 Modernized Toolbar
function Toolbar({ editor }) {
  if (!editor) return null;

  const btnClass = (active) => `
    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
    ${active ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-100'}
  `;

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
        <span className="font-bold text-sm">B</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
        <span className="italic text-sm">I</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))}>
        <span className="line-through text-sm">S</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
        <span className="text-sm font-bold">H2</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}>
        <span className="text-sm font-bold">H3</span>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={btnClass(editor.isActive('link'))}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </button>
    </div>
  );
}

export default function CreateBlog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your story...' }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-indigo max-w-none focus:outline-none min-h-[400px] px-6 py-4 text-gray-800',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const onSubmit = async (data) => {
    const content = editor?.getHTML();
    if (!content || content === '<p></p>') {
      setError('Content cannot be empty');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      await createBlog({ ...data, content, tags: tagArray });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish blog');
    }
    setSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8"
    >
      <Link to="/" className="group inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm font-medium transition-colors">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200/70">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Create your story</h1>
          <p className="text-slate-500 text-sm mb-6">Share your thoughts, tutorials, or experiences with the world.</p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="Your title"
                className="w-full text-2xl sm:text-3xl font-bold text-slate-900 placeholder-slate-300 border-0 p-0 focus:ring-0 focus:outline-none bg-transparent"
              />
              {errors.title && <span className="text-red-500 text-sm mt-1 block">{errors.title.message}</span>}
            </div>
            
            <div className="relative">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="javascript, react, productivity (optional)"
                className="w-full bg-white text-slate-600 placeholder-slate-400 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Toolbar editor={editor} />
          <div className="relative focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-b-xl transition-all">
            <EditorContent editor={editor} />
          </div>
        </div>
        
        <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-200/70 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 hidden sm:block">
            Tip: Use <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600 font-mono text-[10px]">B</kbd> for bold
          </p>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}