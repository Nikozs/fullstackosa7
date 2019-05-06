const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  comment: String,
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
})

commentSchema.statics.format = (comment) => {
  return {
    id: comment._id,
    comment: comment.comment,
    blog: comment.blog
  }
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment