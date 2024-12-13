const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// Rename this to dummy.test.js if we want to use it again

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  
  test('of an empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when a list has only one blog, the sum of likes equals the likes of that blog', () => {
    const result = listHelper.totalLikes(blogs.slice(0, 1))
    assert.strictEqual(result, blogs[0].likes)
  })
  test('of a bigger list is calculated the sum of all likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favourite blog', () => {
  test('the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, blogs[2])
  })
})

describe('most blogs', () => {
  test('the author with the most blogs', (t) => {
    const result = listHelper.mostBlogs(blogs)
    t.diagnostic(JSON.stringify(result), null, 2)
    assert.strictEqual(result.author, 'Robert C. Martin')
    assert.strictEqual(result.count, 3)
  })
})

describe('most likes', () => {  
  test('the author with the most likes', (t) => {
    const result = listHelper.mostLikes(blogs)
    t.diagnostic(JSON.stringify(result))
    assert.strictEqual(result.author, 'Edsger W. Dijkstra')
    assert.strictEqual(result.count, 17)
  })
})