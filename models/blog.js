const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', foreignField: 'blog' }]
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user,
    comments: blog.comments
  }
}

blogSchema.pre('findOne', autoPopulateComments)
blogSchema.pre('find', autoPopulateComments)

function autoPopulateComments (next) {
  this.populate('Comment', 'comment')
  next()
} 

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog