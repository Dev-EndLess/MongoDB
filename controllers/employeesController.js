const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
  res.json(data.employees)
}


// CREATE NEW EMPLOYEE //
const createNewEmployee = (req, res) => {
  const newEmployee = {
    // get the last employee in json array and add + 1 at the array already exist
    // id: data.employees[data.employees.length - 1].id + 1 || 1,
    id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
    // adding firstname and lastname from request
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }

  // if firstname or lastname miss return status 400 with error message
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({ 'message': 'First and last names are required.' })
  }

  // getting employees json and adding the new employee variable
  data.setEmployees([...data.employees, newEmployee])
  res.status(201).json(data.employees)
}


// UPDATE EMPLOYEE //
const updateEmployee = (req, res) => {
  // find in employees json the id === at id from request
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
  // if employee miss return the status 400 with error message
  if (!employee) {
    return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` })
  }
  // if reqest is true employee firstname/lastname become the firstname/lastname from request
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  // getting employees json and filter all id not equal with request id
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
  // getting all filtered employees and adding the new employee variable
  const unsortedArray = [...filteredArray, employee];
  // getting unsortedArray and sort elements... (if a > b return 1)  (if b < a return -1) if even return 0
  data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  res.json(data.employees)
}


// DELETE EMPLOYEE
const deleteEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
  }
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  // set the employee json without the id we filtered
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
}


// SEACH EMPLOYEE
const getEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) {
      return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
}

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
}