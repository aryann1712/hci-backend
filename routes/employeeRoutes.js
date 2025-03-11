const express = require("express");
const updateEmployeeRole = require("../controllers/employeeController/updateEmployeeRole");
const getEmployees = require("../controllers/employeeController/getEmployees");
const { protect } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { updateUserRoleSchema } = require("../validators/userValidators");

const router = express.Router();

// router.put("/", protect, getEmployees);
// router.put("/role/:id", protect, zodValidate(updateUserRoleSchema), updateEmployeeRole);

router.get("/:id", getEmployees);
router.put("/role", updateEmployeeRole);

module.exports = router;
