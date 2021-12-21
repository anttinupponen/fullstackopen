import React from 'react'

const Header = ({header}) => (
  <h1>
    {header}
  </h1>
)
  
const Part = ({name,  exercises}) => (
  <li>
    {name} {exercises}
  </li>
)

const Content = ({parts}) => parts.map(value => <Part key={value.id} name={value.name} exercises={value.exercises}/>)

const Total = ({total}) => {
  const totalText = "Number of exercises"
  return (
    <p style={{fontWeight: "bold"}}>
      {totalText} {total}
    </p>
  )
}

const Course = ({course}) => {
  const total = course.parts.reduce((prev, cur) => prev + cur.exercises, 0)

  return (
    <div>
      <Header header={course.name}/>
      <Content parts={course.parts}/>
      <Total total={total}/>
    </div>
  )
}

export default Course