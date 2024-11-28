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

  return visible ?(
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
      </div>
      <div>
        <input
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleInputChange}
          placeholder="Author"
        />
      </div>
      <div>
        <input
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleInputChange}
          placeholder="URL"
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