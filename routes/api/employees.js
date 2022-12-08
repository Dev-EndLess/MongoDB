const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeesController')
const ROLE_LIST = require('../../config/rolesList')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
  // everyone can access the route
  .get(employeesController.getAllEmployees)
  // limited to admin or editor
  .post(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), employeesController.createNewEmployee)
  .put(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),employeesController.updateEmployee)
  // limited to admin only
  .delete(verifyRoles(ROLE_LIST.Admin),employeesController.deleteEmployee)

// get request param in url 
router.route('/:id')
  .get(employeesController.getEmployee)

module.exports = router