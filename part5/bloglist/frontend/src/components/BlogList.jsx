import PropTypes from 'prop-types'
import Blog from './Blog'
import { useState } from 'react'

const BlogList = ({blogs, showNotification, setBlogs, user}) => {
  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {blogs.sort((a, b) => b.likes - a.likes)
        .map((blog) => <Blog key={'blog'+blog.id} blog={blog} showNotification={showNotification} setBlogs={setBlogs} blogs={blogs} user={user}/>)}
      </ul>
    </div>
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  showNotification: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default BlogList