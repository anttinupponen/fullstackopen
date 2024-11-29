import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import BlogForm from './BlogForm'

// 5.16 done

const blog = {
  title: 'Title',
  author: 'Author',
  url: 'Url',
  likes: 0,
  user: {
    name: 'Name',
    username: 'Username',
    id: 'Id',
  }
}

const user = {
  username: 'Username',
  name: 'Name',
  id: 'Id',
}

test('renders content', () => {

  render(<Blog blog={blog} user={user} showNotification={() => {}} setBlogs={() => {}} blogs={[]} />)

  const title = screen.getByText('Title by Author')
  expect(title).toBeDefined()
  const url = screen.queryByText('Url')
  expect(url).toBeNull()
  const likes = screen.queryByText('0')
  expect(likes).toBeNull()
})

test('clicking the button shows url and likes', async () => {
  render(<Blog blog={blog} user={user} showNotification={() => {}} setBlogs={() => {}} blogs={[]} />)

  const ue = userEvent.setup()
  const button = screen.getByText('show')
  await ue.click(button)

  // Instead of checking mock calls, let's verify the content is shown
  const url = screen.getByText('URL: Url')
  const likes = screen.getByText('Likes: 0')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('clicking the like button twice calls the event handler twice', async () => {
  // Mock the blogService.update function
  const mockUpdate = vi.fn().mockResolvedValue({ message: 'Updated', body: blog })
  const mockSetBlogs = vi.fn()
  
  // Replace the actual update function with our mock
  blogService.update = mockUpdate

  render(
    <Blog 
      blog={blog}
      showNotification={() => {}}
      setBlogs={mockSetBlogs}
      blogs={[blog]}
      user={user}
    />
  )

  const ue = userEvent.setup()
  
  // First show the details to make like button visible
  const showButton = screen.getByText('show')
  await ue.click(showButton)

  // Find and click the like button twice
  const likeButton = screen.getByText('like')
  await ue.click(likeButton)
  await ue.click(likeButton)

  // Check that the update function was called twice
  expect(mockUpdate).toHaveBeenCalledTimes(2)
})

test('BlogForm calls the event handler with correct data when creating a new blog', async () => {
  // Mock the blogService.create function
  const mockCreate = vi.fn().mockResolvedValue({
    message: 'Blog created',
    body: {
      title: 'Test Title',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 0,
      id: 'Id',
      user: {
        name: 'Name',
        username: 'Username',
        id: 'Id',
      }
    }
  })
  blogService.create = mockCreate

  const mockSetBlogs = vi.fn()
  const user = userEvent.setup()

  render(
    <BlogForm 
      setBlogs={mockSetBlogs}
      blogs={[]}
      showNotification={() => {}}
    />
  )

  // First click the "new blog" button to show the form
  const newBlogButton = screen.getByText('new blog')
  await user.click(newBlogButton)

  // Get the input fields
  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')

  // Fill in the form
  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://test.com')

  // Submit the form
  const createButton = screen.getByText('create')
  await user.click(createButton)

  // Check that blogService.create was called with correct data
  expect(mockCreate).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  })
})