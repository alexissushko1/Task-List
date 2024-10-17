const express = require("express");
const router = express.Router();
module.exports = router;

const { authenticate } = require("./auth");
const prisma = require("../prisma");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { ownerId: req.user.id },
    });
    res.json(tasks);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const { name } = req.body;
  try {
    const task = await prisma.task.create({
      data: { name, ownerId: req.user.id },
    });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUniqueOrThrow({ where: { id: +id } });
    if (task.ownerId !== req.user.id) {
      return next({ status: 403, message: "You do not own this task." });
    }
    await prisma.task.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { name, done } = req.body;
  try {
    const task = await prisma.task.findUniqueOrThrow({ where: { id: +id } });
    if (task.ownerId !== req.user.id) {
      return next({ status: 403, message: "You do not own this task." });
    }
    const updatedTask = await prisma.task.update({
      where: { id: +id },
      data: { name, done },
    });
    res.json(updatedTask);
  } catch (e) {
    next(e);
  }
});
