import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState(false)
  const [notification, setNotification] = useState("")
  const [user, setUser] = useState(null)

  const showNotification = (message, error) => {
    setError(error)
    setNotification(message)
    setTimeout(() => {
      setNotification("")
    }, 5000)
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  return (
    <div>
      <h1 style={{ color: 'green', fontStyle: 'italic' }}>Blog App</h1>

      <Notification message={notification} error={error}/>
      
      {!user && <LoginForm setError={setError} showNotification={showNotification} setUser={setUser} />}
      {user && <p>{user.name} logged in <button onClick={logout}>logout</button></p>}
      {user && <BlogForm setBlogs={setBlogs} blogs={blogs} showNotification={showNotification} />}
      {user && <BlogList blogs={blogs} showNotification={showNotification} setBlogs={setBlogs} user={user}/>}



      <footer style={{ marginTop: 20, fontStyle: 'italic' }}>
        Blog app, Department of Questionable Science, Wave University 2024
      </footer>
    </div>
  )
}

export default App