const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// no node:test here, jest is used instead

const { initialBlogs } = require('../utils/list_helper')

const api = supertest(app)

const initialBlogsPoster = async (blogs, token) => {
  const postPromises = blogs.map(blog => {
    return api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
  })
  await Promise.all(postPromises)
}

let authToken, martinToken;
let blogToDelete;
beforeAll(async () => {
  await User.deleteMany({})
  
  const pw = 'testerpw'
  const passwordHash = await bcrypt.hash(pw, 10)
  const user = new User({
    username: 'tester',
    name: 'Test User',
    passwordHash
  })
  await user.save()

  // Login to get token
  const response = await api
    .post('/api/login')
    .send({ username: 'tester', password: pw })
  
  authToken = response.body.token
  // console.log("authToken", authToken)

  // Create and login as Martin
  const martinPassword = 'martinpw'
  const martinPasswordHash = await bcrypt.hash(martinPassword, 10)
  const martin = new User({
    username: 'martin',
    name: 'Robert C. Martin',
    passwordHash: martinPasswordHash
  })
  await martin.save()

  const martinResponse = await api
    .post('/api/login')
    .send({ username: 'martin', password: martinPassword })
  martinToken = martinResponse.body.token
  // console.log("martinToken", martinToken)


})

beforeEach(async () => {
  await Blog.deleteMany({})
  // await Blog.insertMany(initialBlogs)
  const firstHalf = initialBlogs.slice(0, 3)
  const secondHalf = initialBlogs.slice(3)
  // Push first half as blogs of user 'tester' and second half as blogs of user 'martin'
  await Promise.all([
    initialBlogsPoster(firstHalf, authToken),
    initialBlogsPoster(secondHalf, martinToken)
  ])
  const initialBlogsResponse = await api.get('/api/blogs')
  blogToDelete = initialBlogsResponse.body.find(blog => blog.user.username === 'martin')
  console.log("blogToDelete", blogToDelete)
  console.log("martinToken", martinToken)
  const decodedToken = jwt.verify(martinToken, process.env.SECRET)
  console.log("decodedToken", decodedToken)
})



describe('Blog API tests', () => {

  // GET methods don't need auth token
  describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
      const response = await api.get('/api/blogs')
      const blogs = response.body
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)
      blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
        expect(blog._id).toBeUndefined()
      })
    })
  })

  // POST methods need auth token
  describe('POST /api/blogs', () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://testblog.com/',
      likes: 1,
    }
    test('blogs can be added', async () => {
      const response = await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(newBlog)
      expect(response.status).toBe(201)
    })

    test('likes are 0 if not provided', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://testblog.com/',
      }
      const response = await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(newBlog)
      expect(response.body.likes).toBe(0)
    })

    test('title and url are required', async () => {
      const newBlog = {
        author: 'Test Author',
      }
      const response = await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(newBlog)
      expect(response.status).toBe(400)
    })

    test('no token returns 401', async () => {

      const response = await api.post('/api/blogs').send(newBlog)
      expect(response.status).toBe(401)
    })
  })

  // PUT methods need auth token
  // describe('PUT /api/blogs/:id', () => {
  //   test('blog can be updated', async () => {
  //     const newBlog = {
  //       title: 'Updated Blog',
  //       author: 'Updated Author',
  //       url: 'https://updatedblog.com/',
  //       likes: 1,
  //     }
  //     const response = await api.put('/api/blogs/5a422bc61b54a676234d17fc').send(newBlog)
  //     expect(response.status).toBe(200)
  //     expect(response.body.title).toBe(newBlog.title)
  //     expect(response.body.author).toBe(newBlog.author)
  //     expect(response.body.url).toBe(newBlog.url)
  //     expect(response.body.likes).toBe(newBlog.likes)
  //   })
  // })

  // DELETE methods need auth token
  describe('DELETE /api/blogs/:id', () => {


    test('no token returns 401', async () => {
      const response = await api.delete(`/api/blogs/${blogToDelete.id}`)
      expect(response.status).toBe(401)
    })

    test('wrong token returns 403', async () => {
      const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${authToken}`)
      expect(response.status).toBe(403)
    })

    test('blog can be deleted with the correct token', async () => {
      const response = await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${martinToken}`)
      expect(response.status).toBe(200)
    })
    
  })
}) 

// jest compatible way to close the connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close()
})