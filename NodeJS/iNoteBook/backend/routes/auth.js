const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET

//ROUTE 1 : Crete a user using POST : '/api/auth/createuser'. No Login Required
router.post(
  '/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters').isLength({
      min: 8
    })
  ],
  async (req, res) => {
    //If there are errors, return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // console.log(req.body)/

    //Checking whether the user exist with same email already
    
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: 'User already exist!' })
      }

      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt)

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })

      // console.log("user created -- ",user,"user id h ye -- ",user.id)

      const payload = {
        user: {
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
)

//ROUTE 2 : Authenticate a user using POST : '/api/auth/login'. No Login Required
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters').exists()
  ],
  async (req, res) => {
    //If there are errors, return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Enter a valid email and password' })
      }

      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: 'Enter a valid email and password' })
      }

      const payload = {
        user: {
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
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    let userId = req.user.id
    // console.log(userId)
    const user = await User.findById(userId).select('-password')
    res.send(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Some error in getting user details')
  }
})

//ROUTE 4 : Delete logged in user using Delete : '/api/auth/deleteuser'. Login Required
router.delete('/deleteuser', fetchuser, async (req, res) => {
  try {
    let userId = req.user.id
    // console.log(userId)
    const user = await User.findByIdAndDelete(userId)
    res.json({success:"user deleted ",user:user})
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Some error in deleting a user')
  }
})

module.exports = router
