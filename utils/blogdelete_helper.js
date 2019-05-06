const Blog = require('../models/blog')

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog)
}



module.exports = blogsInDb
