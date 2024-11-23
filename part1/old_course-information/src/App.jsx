import React from 'react'

const Header = body => (
  <div>
    <h1>
      {body.header}
    </h1>
  </div>
)

const Part = body => (
  <div>
    <p>
      {body.part} {body.ex}
    </p>
  </div>
)

const Content = body => (
  <div>
    <Part part={body.parts[0].name} ex={body.parts[0].exercises} />
    <Part part={body.parts[1].name} ex={body.parts[1].exercises} />
    <Part part={body.parts[2].name} ex={body.parts[2].exercises} />
  </div>
)


const Total = body => (
  <div>
    <p>
      {body.course.totalText} {body.course.parts[0].exercises + body.course.parts[1].exercises + body.course.parts[2].exercises}
    </p>
  </div>
)
  

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      { 
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ],
    totalText: 'Number of exercises'
  }

  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts} />
      <Total course={course} />
    </div>
  )
}

export default App