const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  if (!id) {
    return response.status(400).json({ error: 'Id is required.' })
  }
  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1, id: 1})
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  // 4.22
  const userId = request.user

  const { title, author, url, likes } = request.body
  if (!title || !url) {
    return response.status(400).json({ error: 'Title and url are required.' })
  }

  const user = await User.findById(userId)
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1, id: 1})
  response.status(201).json({
    message: 'Blog created successfully.',
    body: populatedBlog
  })
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id

  const { likes } = request.body
  const blog = await Blog.findByIdAndUpdate(id, { likes }, { new: true }).populate('user', { username: 1, name: 1, id: 1})
  response.status(200).json({
    message: 'Blog updated successfully.',
    body: blog
  })
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userId = request.user

  const id = request.params.id
  if (!id) {
    return response.status(400).json({ error: 'Id is required' })
  }

  // 4.21
  let blog = await Blog.findById(id)
  if (blog && blog.user.toString() === userId) {
    blog = await Blog.findByIdAndDelete(id)
    if (blog) {
      // 200 for easier debugging
      response.status(200).json({
        message: 'Blog deleted successfully.',
        body: blog
      })
    } else {
      response.status(404).send({
        message: 'Blog not found.'
      })
    }
  } else {
    return response.status(403).json({ error: 'Unauthorized to delete this blog or blog does not exist.' })
  }
  

})

module.exports = blogsRouter