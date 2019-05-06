const supertest = require('supertest')
const request = require('supertest');
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const blogsInDb = require('../utils/blogdelete_helper')

const testBlogs = [
  {
    title: "juu",
    author: "joku",
    url: "jokuosote",
    likes: 7
  },
  {
    title: "juu2",
    author: "joku2",
    url: "jokuosote2",
    likes: 5
  }
]
 token="";

const user="kayttaja4";
const pw="salasana4";


beforeAll(async (done) => {

  await api
  .post('/api/login')
  .send({
    username: user,
    password: pw,
  })
  .then(( response) => {
    // console.log(response);
    token = response.body.token; // token talteen
    done();
  });
console.log("Kutsutaan Blog.remove");
  await Blog.remove({})

  const blogObjects = testBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async (done) => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then((err, response) =>{
        done()
    })

    
})

test('comments are returned as json', async () => {
  await api
    .get('/api/comments')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('a valid blog can be added', async (done) => {
    const blogsAtStart = await blogsInDb()

    console.log("tokeni:")
    console.log(token)

  const newBlog = {
    title: "testiblogi",
    author: "testi",
    url: "jokuosote6",
    likes: 7
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer '+ token)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .then((err, response) =>{
        done()
    })

  const response = await api
    .get('/api/blogs')

    const blogsAfterOperation = await blogsInDb()

  const contents = response.body.map(r => r.title)

  expect(blogsAfterOperation).toBe(blogsAtStart + 1)
  expect(contents).toContain('testiblogi')
})

describe('deletion of a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog({
      title: "testiblogi2",
      author: "testi2",
      url: "jokuosote7",
      likes: 9
    })
    await addedBlog.save()
console.log(addedBlog);
  })

  test('DELETE /api/blogs/:id succeeds with proper statuscode', async (done) => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)
      .then((err, response) =>{
        done()
    })

    const blogsAfterOperation = await blogsInDb()

    const contents = blogsAfterOperation.map(r => r.title)

    expect(contents).not.toContain(addedBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
  })
})