const express = require('express');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: 'Please add title and content' });
    }

    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      tags: req.body.tags || [],
    });

    const populatedBlog = await Blog.findById(blog._id).populate('author', 'username email');

    res.status(201).json(populatedBlog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || blog.title,
        content: req.body.content || blog.content,
        tags: req.body.tags || blog.tags,
      },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    res.status(200).json(blog);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;