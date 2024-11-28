import { useState } from 'react'
import loginService from '../services/login'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const LoginForm = ({ setError, showNotification, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      // dont shadow user for clarity
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      showNotification(`${user.name} logged in`, false)
    } catch (exception) {
      showNotification('wrong credentials', true)
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  setError: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired
}

export default LoginForm