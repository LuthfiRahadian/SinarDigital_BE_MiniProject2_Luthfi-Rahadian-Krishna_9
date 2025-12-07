const prisma = require('../utils/prismaClient');
const { success, error } = require('../utils/response');

async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email }
    });
    return success(res, user, 'User created');
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await prisma.user.count();
    const users = await prisma.user.findMany({
      skip,
      take: Number(limit),
      include: { posts: true },
      orderBy: { createdAt: 'desc' }
    });
    return success(res, { meta: { total, page: Number(page), limit: Number(limit) }, users }, 'Users fetched');
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id }, include: { posts: true }});
    if (!user) return error(res, 'User not found', 404);
    return success(res, user, 'User fetched');
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const updated = await prisma.user.update({
      where: { id },
      data: { name, email }
    });
    return success(res, updated, 'User updated');
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id }});
    return success(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
