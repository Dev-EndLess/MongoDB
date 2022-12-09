const User = require('../model/User')

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt

  // Is refreshToken in database?
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    response.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204) // Success but No content 
  }

  // Delete the RefreshToken in Database
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  console.log(result)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // secure: true - only serves on https
  res.sendStatus(204)
}

module.exports = { handleLogout }