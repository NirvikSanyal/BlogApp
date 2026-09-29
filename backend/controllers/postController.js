const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const uploadDir = path.join(__dirname, '..', 'uploads');
const removeFile = async (image) => {
  if (!image) return;
  const filename = path.basename(image);
  try { await fs.unlink(path.join(uploadDir, filename)); }
  catch (error) { if (error.code !== 'ENOENT') console.error('Could not remove image:', error.message); }
};

exports.getAllPosts = async (req, res, next) => {
  try { res.json(await Post.find().populate('author', 'name').sort({ createdAt: -1 })); }
  catch (error) { next(error); }
};

exports.getPost = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid post id' });
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) { next(error); }
};

exports.createPost = async (req, res, next) => {
  let committed = false;
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
    if (!title || !body) {
      await removeFile(req.file?.filename);
      return res.status(400).json({ message: 'Title and body are required' });
    }
    const post = await Post.create({ title, body, author: req.user._id, image: req.file ? `/uploads/${req.file.filename}` : null });
    committed = true;
    await post.populate('author', 'name');
    res.status(201).json(post);
  } catch (error) {
    if (!committed) await removeFile(req.file?.filename);
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  let committed = false;
  try {
    if (!validId(req.params.id)) {
      await removeFile(req.file?.filename);
      return res.status(400).json({ message: 'Invalid post id' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) { await removeFile(req.file?.filename); return res.status(404).json({ message: 'Post not found' }); }
    if (req.user.role !== 'admin' && !post.author.equals(req.user._id)) {
      await removeFile(req.file?.filename);
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string') { await removeFile(req.file?.filename); return res.status(400).json({ message: 'Title must be text' }); }
      post.title = req.body.title.trim();
    }
    if (req.body.body !== undefined) {
      if (typeof req.body.body !== 'string') { await removeFile(req.file?.filename); return res.status(400).json({ message: 'Body must be text' }); }
      post.body = req.body.body.trim();
    }
    if (!post.title || !post.body) { await removeFile(req.file?.filename); return res.status(400).json({ message: 'Title and body cannot be empty' }); }

    const oldImage = post.image;
    if (req.file) post.image = `/uploads/${req.file.filename}`;
    else if (req.body.removeImage === 'true') post.image = null;
    await post.save();
    committed = true;
    if (oldImage && oldImage !== post.image) await removeFile(oldImage);
    await post.populate('author', 'name');
    res.json(post);
  } catch (error) {
    if (!committed) await removeFile(req.file?.filename);
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid post id' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (req.user.role !== 'admin' && !post.author.equals(req.user._id)) return res.status(403).json({ message: 'You can only delete your own posts' });
    const image = post.image;
    await post.deleteOne();
    await removeFile(image);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) { next(error); }
};
