const express = require("express");

const { asyncHandler } = require("../middlewares/async-handler");
const { User } = require("../models");
const { authenticateUser } = require("../middlewares/auth-user");

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddress,
    });
  })
);

// Route that creates a new user.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).json({ message: "Account successfully created!" });
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

module.exports = router;
