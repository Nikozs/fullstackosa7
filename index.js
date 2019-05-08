const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const commentsRouter = require('./controllers/comments')


mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err => {
    console.log(err)
  })

mongoose.Promise = global.Promise


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
}); 

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)

app.use(middleware.error)
const server = http.createServer(app)

if(!module.parent){
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
    console.log(config.mongoUrl)
  })
}



server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}




