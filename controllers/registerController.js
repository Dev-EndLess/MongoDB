const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
  const { user, pswd } = req.body
  if (!user || !pswd) return res.status(404).json({ 'message': 'Username and password are required' })

  // Using async await you need add exec()
  const duplicate = await User.findOne({ username: user}).exec()
  if (duplicate) return res.sendStatus(409) // Conflict Status

  try {
    // https://www.npmjs.com/package/bcrypt
    // encrypt the password with encrypt package
    const hashedPswd = await bcrypt.hash(pswd, 10)

    // Create and Store the new user
    const result = await User.create({
      "username": user,
      "password": hashedPswd
    })

    // ** we can see also something like this ** //

    // const newUser = new User()
    // const result = await newUser.save()

    // ** or **

    // **  ** //
    // const newUser = newUser({
    //   "username": user,
    //   "password": hashedPswd
    // })
    

    console.log(result)

    res.status(201).json({ 'success': `New user ${user} created!` })

  } catch (error) {
    res.status(500).json({ 'message': error.message })
  }
}

module.exports = { handleNewUser }