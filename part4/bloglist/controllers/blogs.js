const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'Title and url are required' })
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.status(200).json(blog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  if (!id) {
    return response.status(400).json({ error: 'Id is required' })
  }
  const blog = await Blog.findByIdAndDelete(id)
  if (blog) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter