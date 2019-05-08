const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    console.log(body.username)
    const passwordCorrect = user === null ?
      false :
      await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    console.log(process.env.SECRET)

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Something went wrong!' + exception })
  }

})

module.exports = loginRouter