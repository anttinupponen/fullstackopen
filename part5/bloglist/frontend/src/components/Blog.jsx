import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, showNotification, setBlogs, blogs, user }) => {
  const [shown, setShown] = useState(false)

  const toggleShown = () => {
    setShown(!shown)
  }

  const blogStyle = {
    paddingTop: 5,    // Reduced from 10
    paddingBottom: 2, // Added padding bottom
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    button: {
      marginLeft: 5,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: 0,      // Remove default margin
    },
    title: {
      fontSize: '1rem',  // Normal font size
      margin: 0,         // Remove default margin
      fontWeight: 'bold' // Keep it distinct
    },
    content: {
      margin: 0,     // Remove default margin
      padding: '2px 0'  // Add minimal vertical padding
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
    <article role="listitem" aria-label={`${blog.title} by ${blog.author}`} style={blogStyle}>
      <header style={blogStyle.header}>
        <h3 style={blogStyle.title}>{blog.title} by {blog.author}</h3>
        <button 
          style={blogStyle.button} 
          onClick={toggleShown}
          aria-expanded={shown}
          aria-controls={`blog-${blog.id}-details`}>
          {shown ? 'hide' : 'show'}
        </button>
      </header>
      <section 
        id={`blog-${blog.id}-details`} 
        aria-hidden={!shown}>
        {shown && (
          <>
            <p style={blogStyle.content}>URL: {blog.url}</p>
            <p style={blogStyle.content}>
              Likes: {blog.likes}
              <button 
                style={blogStyle.button} 
                onClick={handleLike}
                aria-label={`Like ${blog.title}`}>
                like
              </button>
            </p>
            <p style={blogStyle.content}>Added by {blog.user.name}</p>
            {blog.user.username === user.username && (
              <button 
                style={blogStyle.button} 
                onClick={handleDelete}
                aria-label={`Delete ${blog.title}`}>
                delete
              </button>
            )}
          </>
        )}
      </section>
    </article>
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
