const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
/*const User = require('../models/user')
const jwt = require('jsonwebtoken')*/


commentsRouter.get('/', async (request, response) => {
  const comments = await Comment
    .find({})
  
  response.json(comments.map(Comment.format))
})


commentsRouter.get('/:id', (request, response) => {
  Comment
    .findById(request.params.id)
    .then(comment => {
      if (comment) {
        response.json(Comment.format(comment))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted idffsfsdf' })
    })
})


commentsRouter.post('/:id', async (request, response) => {
  const body = request.body

  try {

    if (body.comment === undefined) {
      response.status(400).json({ error: 'content missing' })
    }
    
    const comment = new Comment({
      comment: body.comment,
      blog: request.params.id
    })

    const savedComment = await comment.save()
    
    response.json(Comment.format(savedComment))
    
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})



module.exports = commentsRouter