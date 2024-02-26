const jwt = require('jsonwebtoken')

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(req,data)
    req.user = data.user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = fetchuser
