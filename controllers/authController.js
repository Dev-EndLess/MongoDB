const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  const { user, pswd } = req.body
  if (!user || !pswd) return res.status(400).json({ 'message': 'Username and password are require' })
  //
  const foundUser = await User.findOne({ username: user }).exec()
  if (!foundUser) return res.sendStatus(401) // Not Authorized

  // control if password match
  const matchPswd = await bcrypt.compare(pswd, foundUser.password)
  if (matchPswd) {

    const roles = Object.values(foundUser.roles).filter(Boolean)
    // create JWT
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      },
      'process.env.ACCESS_TOKEN_SECRET',
      { expiresIn: '60s' }
    )

    // create refresh Token  
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      'process.env.REFRESH_TOKEN_SECRET',
      { expiresIn: '1d' }
    )

    // Saving refresh Token with current user
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log(result)

    // set cookie as http only is not avaible to javascript 
    // much more secure than store in local storage or cookie avaible to javascript          // 1 day
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
    // secure: true ( in production ) or we cant test with thunderclient

    // in the frontend you store this access token in memory 
    // not secure in local storage

    // Send authorization roles and access token to user
    res.json({ roles, accessToken });

  } else {
    res.sendStatus(401)
  }
}

module.exports = { handleLogin }