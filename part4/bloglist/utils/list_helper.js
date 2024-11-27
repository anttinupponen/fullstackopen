const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, 0)
}

const mostBlogs = (blogs) => {
  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })
  let max = { author: '', count: 0 }
  Object.entries(counts).forEach(([author, count]) => {
    if (count > max.count) {
      max = { author, count }
    }
  })
  return max
}

const mostLikes = (blogs) => {
  const likes = {}
  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })
  let max = { author: '', count: 0 }
  Object.entries(likes).forEach(([author, count]) => {
    if (count > max.count) {
      max = { author, count }
    }
  })
  return max
}

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }  
]

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs
}