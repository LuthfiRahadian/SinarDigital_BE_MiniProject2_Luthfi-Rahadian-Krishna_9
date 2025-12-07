const prisma = require('../utils/prismaClient');
const { success, error } = require('../utils/response');
const fs = require('fs');
const path = require('path');

async function createPost(req, res, next) {
  try {
    const { title, content, userId } = req.body;
    let imagePath = null;
    if (req.file) {
      imagePath = path.join(process.env.UPLOAD_DIR || 'uploads', req.file.filename);
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imagePath,
        userId: Number(userId)
      }
    });
    return success(res, post, 'Post created');
  } catch (err) {
    next(err);
  }
}

async function getPosts(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await prisma.post.count();
    const posts = await prisma.post.findMany({
      skip,
      take: Number(limit),
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    return success(res, { meta: { total, page: Number(page), limit: Number(limit) }, posts }, 'Posts fetched');
  } catch (err) {
    next(err);
  }
}

async function getPostById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const post = await prisma.post.findUnique({ where: { id }, include: { user: true }});
    if (!post) return error(res, 'Post not found', 404);
    return success(res, post, 'Post fetched');
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, content, userId } = req.body;
    const existing = await prisma.post.findUnique({ where: { id }});
    if (!existing) return error(res, 'Post not found', 404);

    // If new file uploaded, delete old file
    let imagePath = existing.imagePath;
    if (req.file) {
      // remove old
      if (existing.imagePath) {
        try {
          fs.unlinkSync(path.resolve(existing.imagePath));
        } catch (e) {
          // ignore if file not found
        }
      }
      imagePath = path.join(process.env.UPLOAD_DIR || 'uploads', req.file.filename);
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        imagePath,
        userId: userId ? Number(userId) : existing.userId
      }
    });

    return success(res, updated, 'Post updated');
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.post.findUnique({ where: { id }});
    if (!existing) return error(res, 'Post not found', 404);

    // delete image file if exists
    if (existing.imagePath) {
      try {
        fs.unlinkSync(path.resolve(existing.imagePath));
      } catch (e) {
        // ignore
      }
    }

    await prisma.post.delete({ where: { id }});
    return success(res, null, 'Post deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };

