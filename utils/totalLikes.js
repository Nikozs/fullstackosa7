const totalLikes = (blogs) => {
  console.log('totalLikes')
  return blogs.map(blog => blog.likes).reduce((prev, next) => prev + next);

}

module.exports = {
  totalLikes
}