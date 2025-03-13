const express = require("express");
const { updateUserRoleSchema } = require("../validators/userValidators");
const getCustomers = require("../controllers/customerController/getCustomers");
const updateCustomerStatus = require("../controllers/customerController/updateCustomerStatus");

const router = express.Router();

// router.put("/", protect, getEmployees);
// router.put("/role/:id", protect, zodValidate(updateUserRoleSchema), updateEmployeeRole);

router.get("/:id", getCustomers);
router.put("/status", updateCustomerStatus);

module.exports = router;
