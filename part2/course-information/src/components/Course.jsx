import PropTypes from 'prop-types'

const Header = ({header}) => (
  <h1>{header}</h1>
)
  
const Part = ({name,  exercises}) => (
  <li>{name} {exercises}</li>
)

const Content = ({parts}) => parts.map(part =>
  <Part key={part.id} name={part.name} exercises={part.exercises}/>
)

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

// prop types
Course.propTypes = {
  course: PropTypes.object.isRequired
}

Header.propTypes = {
  header: PropTypes.string.isRequired
}

Part.propTypes = {
  name: PropTypes.string.isRequired,
  exercises: PropTypes.number.isRequired
}

Total.propTypes = {
  total: PropTypes.number.isRequired
}

export default Course