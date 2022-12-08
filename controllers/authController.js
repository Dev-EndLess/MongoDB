const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
  const { user, pswd } = req.body
  if (!user || !pswd) return res.status(400).json({ 'message': 'Username and password are require' })
  //
  const foundUser = usersDB.users.find(person => person.username === user)
  if (!foundUser) return res.sendStatus(401) // Not Authorized

  // control if password match
  const matchPswd = await bcrypt.compare(pswd, foundUser.password)
  if (matchPswd) {

    const roles = Object.values(foundUser.roles)
    // create JWT
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      },
      'process.env.ACCESS_TOKEN_SECRET',
      { expiresIn: '30s' }
    )

    // create refresh Token  
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      'process.env.REFRESH_TOKEN_SECRET',
      { expiresIn: '1d' }
    )

    // Saving refresh Token with current user
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
    const currentUser = { ...foundUser, refreshToken }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )

    // set cookie as http only is not avaible to javascript
    // much more secure than store in local storage or cookie avaible to javascript
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }) // 1 day

    // in the frontend you store this access token in memory 
    // not secure in local storage
    res.json({ accessToken })
  } else {
    res.sendStatus(401)
  }
}

module.exports = { handleLogin }