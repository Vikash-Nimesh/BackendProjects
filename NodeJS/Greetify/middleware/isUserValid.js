const jwt = require('jsonwebtoken')
const User = require('../model/User')

const isUserValid = async (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    let findUser = await User.findById(data.user_data.id).select('-user_password')
    if (!findUser) {
      return res.status(404).json({ error: 'User Not Found' })
    }
    // const newUSerObj = JSON.parse(JSON.stringify(findUser))
    // delete newUSerObj.user_password
    req.user_data = findUser
    next()
  } catch (error) {}
}

module.exports = isUserValid
