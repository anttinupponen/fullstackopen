import { useState, useEffect } from 'react'
// import axios from 'axios'
import service from './service'
import Notification from './Notification'

// 2.17

const Filter = ({filter, filterHandler}) => (
  <div>
    Filter: <input value={filter} onChange={filterHandler}/>
  </div>
)

const Person = ({person, func}) => (
  <li style={{ display: 'flex', alignItems: 'center' }}>
    <p style={{ marginRight: '10px' }}> {person.name} {person.number} </p>
    <button onClick={() => func(person.id)}>Delete</button>
  </li>
)

const Contacts = ({contacts, filter, func}) => (
  <ul>
    {contacts.filter(v => v.name.toLowerCase().includes(filter.toLowerCase()))
            .map((person) => <Person key={'person'+person.id} person={person} func={func}/>)}
  </ul>
)

const PersonForm = ({callback, name, nameHandler, number, numHandler}) => (
  <form onSubmit={callback}>
    <div>
      Name: <input value={name} onChange={nameHandler}/>
    </div>
    <div>
      Number: <input value={number} onChange={numHandler}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)






const App = () => {
  
  //
  // States
  //

  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ message, setMessage ] = useState('')
  // Separating error and message states for clarity just feels more consistent
  const [ error, setError ] = useState(false)

  // Initial data fetch
  useEffect(() => {
    console.log('effect triggered')
    service.getAll().then(res => setPersons(res))
  }, [message])


  //
  // Event handlers
  //

  const nameHandler = (event) => {
    setNewName(event.target.value)
  }

  const numHandler = (event) => {
    setNewNumber(event.target.value)
  }
  
  const filterHandler = (event) => {
    setNewFilter(event.target.value)
  }

  //
  // CRUD operations and state updates
  //

  // Delete person from server and state, provides input for Notification
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    // Would need some error handling actually
    // Return if user cancels
    if (!window.confirm(`Delete ${person.name}?`)) return

    service.remove(id)
    .then(res => {
      setError(false)
      setMessage(`Deleted ${person.name}`)
      console.log("Deleted person:", res)
    })
    .catch(err => {
      setError(true)
      const msg = err.response.status === 404 ? `Information of ${person.name} is already deleted.` : `Failed to delete ${person.name} for an unknown reason`
      setMessage(msg)
      // alert(`Person with id: ${id} already deleted`)
      console.log(err)
    })

    // Update state, filter out deleted person
    setPersons(persons.filter(p => p.id !== id))

    // Hide notification after 3 seconds
    setTimeout(() => {
      setMessage('')
    }, 3000)
    
  }

  // Called by onSubmit if the person already exists
  const updatePerson = (person) => {
    service.update(person)
    .then(res => {
      // Update state
      setPersons(persons.map(p => p.id !== person.id ? p : person))
      console.log("Updated person:", res)
    })
    .catch(console.log)
  }

  // Called by onSubmit if the person doesn't exist
  const createPerson = (person) => {
    service.create(person)
    .then(res => {
      console.log("Created new person:", res)
      setPersons(persons.concat(person))
    })
    .catch(console.log)
  }

  //
  // Form submission logic
  //
  
  const onSubmit = (event) => {
    event.preventDefault()


    // Input validation clauses, cba to make cleaner
    if (newName === '') {
      alert('Name cannot be empty')
      return
    }

    // We don't do GDPR shit here
    if (newNumber === '') {
      alert('Number cannot be empty')
      return
    }

    let msg = `${newName} added to phonebook`
  
    // If the person already exists, ask if user wants to update the number and return
    const person = persons.find(p => p.name === newName)
    // When using multiple sessions we would need to communicate to the server instead of locally
    // service.getAll().then(response => response.find(p => p.name === newName)).then(...)
    console.log(person)
    if (person !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        person.number = newNumber
        updatePerson(person)
        msg = `${newName}'s number updated`
      }

    // Don't allow duplicate numbers otherwise
    } else if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} number already in phonebook`)
      return

    // Create a new record if the other criteria are not met
    } else {

      // Create new person object with an incrementing id
      const newPerson = {
        name: newName,
        number: newNumber,
        // Get max id of persons array and add 1 to ensure a unique new index
        // Deletions will leave gaps in the id sequence so this fixes that
        id: Math.max(...persons.map(p => p.id)) + 1
      }

      // Push new person to server and update state
      createPerson(newPerson)
    }


    // Set new states
    setNewName('')
    setNewNumber('')

    // Set notification
    setError(false)
    setMessage(msg)

    // Hide notification after 3 seconds
    setTimeout(() => {
      setMessage('')
    }, 3000)

  }

  //
  // DOM
  //

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error}/>

      <Filter filter={newFilter} filterHandler={filterHandler}/>

      <h3>Add a new contact</h3>

      <PersonForm callback={onSubmit} name={newName} nameHandler={nameHandler} number={newNumber} numHandler={numHandler}/>

      <h3>Contact list</h3>

      <Contacts contacts={persons} filter={newFilter} func={deletePerson}/>

    </div>
  )
}

export default App