const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 500,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);