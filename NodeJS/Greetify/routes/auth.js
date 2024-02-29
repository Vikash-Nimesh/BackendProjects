const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const isUserValid = require('../middleware/isUserValid')

// ROUTE 1 : Creating a new user using POST : '/api/auth/createuser' = NO LOGIN REQUIRED
router.post('/createuser', [
  body('user_name', 'Enter a valid name').exists(),
  body('user_email', 'Enter a valid email').isEmail(),
  body('user_password', 'Password should be 8 characters long').isLength({
    min: 8
  }),
  async (req, res) => {
    //If there are errors, return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      let isUserAlreadyExist = await User.findOne({
        user_email: req.body.user_email
      })
      if (isUserAlreadyExist) {
        return res.status(400).json({ error: 'User already exist!' })
      }

      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.user_password, salt)

      let user = await User.create({
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: secPass
      })

      const payload = {
        user_data: {
          id: user.id
        }
      }

      const authtoken = jwt.sign(payload, JWT_SECRET)
      console.log(authtoken)
      res.json({ authtoken })
    } catch (error) {
      console.log(error.message)
      res.status(500).send('Some error in creating user')
    }
  }
])

// ROUTE 2 Login a existing user using POST : '/api/auth/loginuser' NO LOGIN REQUIRED
router.post(
  '/loginuser',
  [
    body('user_email', 'Enter a valid email').isEmail(),
    body('user_password', 'Password must be atleast 8 characters').exists()
  ],
  async (req, res) => {
    //If there are errors, return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { user_email, user_password } = req.body
    try {
      let user = await User.findOne({ user_email })
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Enter a valid email and password' })
      }

      const passwordCompare = await bcrypt.compare(
        user_password,
        user.user_password
      )
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: 'Enter a valid email and password' })
      }

      const payload = {
        user_data: {
          id: user.id
        }
      }

      const authtoken = jwt.sign(payload, JWT_SECRET)
      res.json({ authtoken })
    } catch (error) {
      console.log(error.message)
      res.status(500).send('Some error in login user')
    }
  }
)

//ROUTE 3 : Get logged in user details using POST : '/api/auth/getuser'. Login Required
router.post('/getuser', isUserValid, async (req, res) => {
  try {
    let user_data = req.user_data
    res.send(user_data)
    console.log(user_data)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Some error in getting user details')
  }
})

//ROUTE 4 : Delete logged in user using Delete : '/api/auth/deleteuser'. Login Required
router.delete('/deleteuser', isUserValid, async (req, res) => {
  try {
    let userId = req.user_data.id
    // console.log(userId)
    const user = await User.findByIdAndDelete(userId)
    res.json({ success: 'user deleted ', user: user })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Some error in deleting a user')
  }
})




module.exports = router
