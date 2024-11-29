import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({setBlogs, blogs, showNotification}) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [visible, setVisible] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await blogService.create(newBlog)
      setNewBlog({ title: '', author: '', url: '' })
      setBlogs(blogs.concat(response.body))
      showNotification(`${response.body.title} by ${response.body.author} added`, false)
      console.log(response.message, response.body)
    } catch (error) {
      showNotification('Error creating blog. See console for details.', true)
      console.error('Error creating blog:', error)
    }
  }

  const handleCancel = (event) => {
    event.preventDefault()
    //setNewBlog({ title: '', author: '', url: '' })
    setVisible(false)
  }

  return visible ? (
    <form onSubmit={handleSubmit} aria-label="Create new blog">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleInputChange}
          placeholder="Title"
          aria-label="Blog title"
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          id="author"
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleInputChange}
          placeholder="Author"
          aria-label="Blog author"
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          id="url"
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleInputChange}
          placeholder="URL"
          aria-label="Blog URL"
        />
      </div>
      <button type="submit">create</button>
      <button onClick={handleCancel}>cancel</button>
    </form>
  ) : (
    <button onClick={() => setVisible(true)}>new blog</button>
  )
}

BlogForm.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default BlogForm