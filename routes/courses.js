const express = require("express");
const { authenticateUser } = require("../middlewares/auth-user");

const { asyncHandler } = require("../middlewares/async-handler");
const { Course, User } = require("../models");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.json(courses);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!course)
      return res
        .status(404)
        .send({ message: "The course with the given ID was not found." });
    res.json(course);
  })
);

router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res
        .status(201)
        .location("/api/courses/" + course.id)
        .end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res
        .status(404)
        .send({ message: "The course with the given ID was not found." });
    }
    if (course.userId !== req.currentUser.id) {
      return res
        .status(403)
        .send({ message: "You are not authorized to modify this course." });
    }

    try {
      await course.update(req.body);
      res.status(204).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res
        .status(404)
        .send({ message: "The course with the given ID was not found." });
    }
    if (course.userId !== req.currentUser.id) {
      return res
        .status(403)
        .send({ message: "You are not authorized to modify this course." });
    }

    await course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
