const { test, expect, beforeEach, describe, beforeAll, afterAll } = require('@playwright/test')
const { loginWith, createUserOverAPI, loginOverAPI, createBlogOverAPI } = require('./helper')

const username = "testuser"
const password = "testpassword"
const name = "Test User"

const username2 = "user2"
const password2 = "pass2"
const name2 = "Second User"

describe('Blog app tests.', () => {

  let token = null
  beforeAll(async ({ request }) => {
    // 5.18
    // Make the calls once only to store the user and blog in the database, since we want them anyway.
    await createUserOverAPI(request, name, username, password)
    await createUserOverAPI(request, name2, username2, password2)
    const user = await loginOverAPI(request, username, password)
    token = user.token
  })

  beforeEach(async ({ page, request }) => {
    // 5.17
    await request.post('http://localhost:3003/api/testing/init')
    await createBlogOverAPI(request, token, 'Test Blog', 'Test Author', 'http://test.com', 1)

    await page.goto('http://localhost:5173')
  })

  afterAll(async ({ request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
  })

  // 5.17
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  // 5.18
  describe('Login', () => {
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, username, 'wrong')

      const notification = page.getByRole('alert')
      await expect(notification).toHaveText('wrong credentials')
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, username, password)

      await expect(page.getByRole('navigation', { name: 'user' })).toContainText(`Logged in as ${name}`)
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, username, password)
    })

    // 5.19
    test('A blog can be created', async ({ page, request }) => {
      // First click the "new blog" button if it's not already visible
      await page.getByRole('button', { name: 'new blog' }).click()

      // Get the form first
      const form = page.getByRole('form', { name: 'new blog' })

      await form.getByRole('textbox', { name: 'title' }).fill('Freshly created blog')
      await form.getByRole('textbox', { name: 'author' }).fill('Test Author')
      await form.getByRole('textbox', { name: 'url' }).fill('http://test.com')
      await form.getByRole('button', { name: 'create' }).click()
      await expect(page.getByRole('listitem', { name: 'Freshly created blog by Test Author' })).toBeVisible()
    })

    // 5.20
    test('User can like a blog', async ({ page }) => {
      // Find a specific blog first
      const blogEntry = page.getByRole('listitem', { 
        name: 'Test Blog by Test Author' 
      })
      
      // Click its show button
      await blogEntry.getByRole('button', { name: 'show' }).click()
      
      // Click like and verify the count increased
      await blogEntry.getByRole('button', { name: 'like' }).click()
      
      // Verify the likes increased within this specific blog entry
      await expect(blogEntry.getByText('Likes: 1')).toBeVisible()
    })

    // 5.21
    test('User can delete their own blog', async ({ page }) => {
      // Find a specific blog first
      const blogEntry = page.getByRole('listitem', { 
        name: 'Test Blog by Test Author' 
      })

      // Click delete and handle the confirmation dialog
      page.on('dialog', dialog => dialog.accept())

      // Click its buttons
      await blogEntry.getByRole('button', { name: 'show' }).click()
      await blogEntry.getByRole('button', { name: 'delete' }).click()

      // Verify blog is gone and notification is shown
      await expect(blogEntry).not.toBeVisible()
      await expect(page.getByRole('alert')).toHaveText('Test Blog by Test Author deleted.')

    })

    // 5.22
    test('Delete button only visible to blog creator', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
      // Logout the default user who owns the blog
      await page.getByRole('button', { name: 'logout' }).click()
  
      // Login as second user
      await page.goto('http://localhost:5173')
      await loginWith(page, username2, password2)
  
      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()
      // Click the 'show' button and verify delete button is not visible
      const blogEntry = page.getByRole('listitem', { 
        name: 'Test Blog by Test Author' 
      })
      await blogEntry.getByRole('button', { name: 'show' }).click()
      await expect(blogEntry.getByRole('button', { name: 'delete' })).not.toBeVisible()

    })

    // 5.23
    test('Blogs are ordered by likes', async ({ page, request }) => {
      // Create additional blogs with different like counts
      const blogsToCreate = [
        { title: 'Most likes', author: 'Author 1', url: 'http://test1.com', likes: 15 },
        { title: 'Second most', author: 'Author 2', url: 'http://test2.com', likes: 10 },
        { title: 'Few likes', author: 'Author 3', url: 'http://test3.com', likes: 1 }
      ]

      // Create blogs directly via API for efficiency and to set initial likes
      for (const blog of blogsToCreate) {
        await createBlogOverAPI(request, token, blog.title, blog.author, blog.url, blog.likes)
      }

      // Refresh the page to see the new blogs because of using API
      await page.reload()

      await expect(page.getByRole('heading', { name: 'Blogs' })).toBeVisible()

      // Wait for all blogs to be present before proceeding
      await expect(page.getByRole('listitem')).toHaveCount(4) // 3 new blogs + 1 initial blog
      
      // Instead of collecting all buttons first, handle one blog at a time
      const blogs = await page.getByRole('listitem').all()
      for (const blog of blogs) {
        const showButton = blog.getByRole('button', { name: 'show' })
        await expect(showButton).toBeVisible()
        await showButton.click()
      }

      // Get all blog elements and their like counts
      const likes = []

      for (const blog of blogs) {
        const likeText = await blog.getByText(/Likes: \d+/).textContent()
        likes.push(parseInt(likeText.match(/\d+/)[0]))
      }
      
      // Verify likes are in descending order
      const sortedLikes = [...likes].sort((a, b) => b - a)
      expect(likes).toEqual(sortedLikes)
    })
  })
})