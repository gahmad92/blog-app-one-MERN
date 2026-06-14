import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getBlog, updateBlog } from '../hooks/useBlog';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <span className="font-bold text-sm">B</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <span className="italic text-sm">I</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <span className="line-through text-sm">S</span>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <span className="text-sm font-bold">H2</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <span className="text-sm font-bold">H3</span>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button type="button" onClick={() => { const url = window.prompt('Enter URL'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-indigo-600' : 'text-gray-700'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </button>
    </div>
  );
}

export default function EditBlog() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const editor = useEditor({
    extensions: [StarterKit, LinkExtension.configure({ openOnClick: false }), Placeholder.configure({ placeholder: 'Tell your story...' })],
    editorProps: { attributes: { class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4 text-slate-800' } },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchBlog = useCallback(async () => {
    try {
      const data = await getBlog(id);
      setValue('title', data.title, { shouldValidate: true });
      editor?.commands.setContent(data.content);
      setTags(data.tags?.join(', ') || '');
    } catch (err) {
      console.error(err);
      navigate('/');
    }
    setLoading(false);
  }, [editor, id, navigate, setValue]);

  useEffect(() => {
    if (editor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchBlog();
    }
  }, [editor, fetchBlog]);

  const onSubmit = async (data) => {
    const content = editor?.getHTML();
    if (!content || content === '<p></p>') { setError('Content is required'); return; }
    setSubmitting(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      await updateBlog(id, { ...data, content, tags: tagArray });
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <Link to={`/blog/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to story
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-200/70">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit your story</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>}
          <div className="mb-6">
            <input {...register('title', { required: 'Title is required' })} className="w-full text-3xl font-bold text-slate-900 placeholder-slate-300 border-0 p-0 focus:ring-0 focus:outline-none bg-transparent" />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>
          <div className="mb-6">
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="javascript, react, productivity" className="w-full bg-white text-slate-600 placeholder-slate-400 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
          </div>
        </div>
        <div className="border-b border-slate-200/70">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <div className="p-8 bg-slate-50/80 border-t border-slate-200/70 flex justify-end gap-4">
          <button type="button" onClick={() => navigate(`/blog/${id}`)} className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
          <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm">
            {submitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}