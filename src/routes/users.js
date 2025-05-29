const express = require("express");
const router = express.Router();
const {
  signin,
  newUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/users");
const { authorizeRoles, authenticate } = require("../middleware/auth");

router.post("/signin", signin);
router.post("/register", authenticate, authorizeRoles("admin"), newUser);
// router.get("/", getUsers);
router.get("/", authenticate, authorizeRoles("admin"), getUsers);
router.get("/:id", authenticate, authorizeRoles("admin"), getUserById);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);
router.put("/:id", authenticate, authorizeRoles("admin"), updateUser);

module.exports = router;
