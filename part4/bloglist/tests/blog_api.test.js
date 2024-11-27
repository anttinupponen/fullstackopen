const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
// no node:test here, jest is used instead

const { initialBlogs } = require('../utils/list_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

const api = supertest(app)

describe('Blog API tests', () => {

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


  describe('POST /api/blogs', () => {
    test('blogs can be added', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'New Author',
        url: 'https://newblog.com/',
        likes: 1,
      }
      const response = await api.post('/api/blogs').send(newBlog)
      expect(response.status).toBe(201)
    })

    test('likes are 0 if not provided', async () => {
      const newBlog = {
        title: 'No likes',
        author: 'Author with no likes',
        url: 'https://nolikes.com/',
      }
      const response = await api.post('/api/blogs').send(newBlog)
      expect(response.body.likes).toBe(0)
    })

    test('title and url are required', async () => {
      const newBlog = {
        author: 'Only author',
      }
      const response = await api.post('/api/blogs').send(newBlog)
      expect(response.status).toBe(400)
    })
  })

  describe('PUT /api/blogs/:id', () => {
    test('blog can be updated', async () => {
      const newBlog = {
        title: 'Updated Blog',
        author: 'Updated Author',
        url: 'https://updatedblog.com/',
        likes: 1,
      }
      const response = await api.put('/api/blogs/5a422bc61b54a676234d17fc').send(newBlog)
      expect(response.status).toBe(200)
      expect(response.body.title).toBe(newBlog.title)
      expect(response.body.author).toBe(newBlog.author)
      expect(response.body.url).toBe(newBlog.url)
      expect(response.body.likes).toBe(newBlog.likes)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('blog can be deleted', async () => {
      const response = await api.delete('/api/blogs/5a422bc61b54a676234d17fc')
      expect(response.status).toBe(204)
    })
  })
}) 

// jest compatible way to close the connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close()
})