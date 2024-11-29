const loginWith = async (page, username, password)  => {
  await page.getByRole('textbox', { name: 'Username' }).fill(username)
  await page.getByRole('textbox', { name: 'Password' }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createUserOverAPI = async (request, name, username, password) => {
  const response = await request.post('http://localhost:3003/api/users', {
    data: { name, username, password },
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.json()
}

const createBlogOverAPI = async (request, token, title, author, url, likes = 0) => {
  const response = await request.post('http://localhost:3003/api/blogs', {
    data: {
      title, author, url, likes
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
  return response.json()
}

const loginOverAPI = async (request, username, password) => {
  const response = await request.post('http://localhost:3003/api/login', {
    data: {
      username,
      password
    },
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.json()
}

export { loginWith, createBlogOverAPI, createUserOverAPI, loginOverAPI }