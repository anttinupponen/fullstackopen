import PropTypes from 'prop-types'
import Blog from './Blog'
import { useState } from 'react'

const BlogList = ({blogs, showNotification, setBlogs, user}) => {
  const [showImportant, setShowImportant] = useState(false)
  return (
    <div>
      <h2>Blogs</h2>
      <button onClick={() => setShowImportant(!showImportant)}>
        {showImportant ? 'show all' : 'show important'}
      </button>
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