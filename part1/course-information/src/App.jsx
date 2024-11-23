import PropTypes from 'prop-types'

const Header = props => (
  <>
    <h1>{props.header}</h1>
  </>
)

const Part = props => (
  <>
    <p>{props.part} {props.ex}</p>
  </>
)

const Content = props => (
  <>
    <Part part={props.parts[0].name} ex={props.parts[0].exercises} />
    <Part part={props.parts[1].name} ex={props.parts[1].exercises} />
    <Part part={props.parts[2].name} ex={props.parts[2].exercises} />
  </>
)


const Total = props => {
  const sum = props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises
  return (
    <>
      <p>{props.course.totalText} {sum}</p>
    </>
  )
}
 
// no need to keep inside App
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

const App = () => {

  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts} />
      <Total course={course} />
    </div>
  )
}

// typing
Header.propTypes = {
  header: PropTypes.string.isRequired
}

Part.propTypes = {
  part: PropTypes.string.isRequired,
  ex: PropTypes.number.isRequired
}

Content.propTypes = {
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      exercises: PropTypes.number.isRequired
    })
  ).isRequired
}

Total.propTypes = {
  course: PropTypes.shape({
    totalText: PropTypes.string.isRequired,
    parts: PropTypes.arrayOf(
      PropTypes.shape({
        exercises: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired
}

export default App