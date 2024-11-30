import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const style = {
    border: '1px solid black',
    borderRadius: 5,
    padding: 10,
    maxWidth: '800px',
    width: '93%',
    margin: '10px -10px 2px 5px',
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification