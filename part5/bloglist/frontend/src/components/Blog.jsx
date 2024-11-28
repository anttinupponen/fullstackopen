import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, showNotification, setBlogs, blogs, user }) => {
  const [shown, setShown] = useState(false)

  const toggleImportance = () => {
    setShown(!shown)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    button: {
      marginLeft: 5,
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
  }

  const deleteBlog = (deletedBlog) => {
    setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id))
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      const response = await blogService.update(blog.id, updatedBlog)
      updateBlog(updatedBlog)  // Call the handler from parent
      showNotification(`${updatedBlog.title} by ${updatedBlog.author} had its likes updated.`, false)
      console.log(response.message, response.body)
    } catch (error) {
      console.error('Error updating likes:', error)
      showNotification('Error updating likes. See console for details.', true)
    }
  }

  const handleDelete = async () => {
    try {
      if (!window.confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`)) {
        return
      }
      const response = await blogService.remove(blog.id)
      deleteBlog(response.body)
      showNotification(`${response.body.title} by ${response.body.author} deleted.`, false)
      console.log(response.message, response.body)
    } catch (error) {
      console.error('Error deleting blog:', error)
      showNotification('Error deleting blog. See console for details.', true)
    }
  }

  return (
    <div style={blogStyle}>
      <div>{blog.title} by {blog.author}
        <button style={blogStyle.button} onClick={toggleImportance}>
          {shown ? 'hide' : 'show'}
        </button>
      </div>
      {shown && (
        <>
          <div>URL: {blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button style={blogStyle.button} onClick={handleLike}>like</button>
          </div>
          <div>Added by {blog.user.name}</div>
          <div>ID: {blog.id}</div>
          {blog.user.username === user.username && <button style={blogStyle.button} onClick={handleDelete}>delete</button>}
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
