import { useState, useEffect } from 'react'
import Service from './components/Service'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import ContactList from './components/ContactList'
import Filter from './components/Filter'

// 2.17

const App = () => {
  
  // States

  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ message, setMessage ] = useState('')
  // Separating error and message states for clarity; just feels more consistent
  const [ error, setError ] = useState(false)

  // Initial data fetch, triggered by message state change.
  useEffect(() => {
    Service.getAll().then(res => setPersons(res))
  }, [message])


  // Event handlers
  const nameHandler = (event) => setNewName(event.target.value)
  const numHandler = (event) => setNewNumber(event.target.value)
  const filterHandler = (event) => setNewFilter(event.target.value)

  // CRUD operations and state updates

  // Delete person from server and state, provides input for Notification
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    // Would need some error handling
    // Return if user cancels
    if (!window.confirm(`Delete ${person.name}?`)) return

    Service.remove(id)
    .then(res => {
      setError(false)
      setMessage(`Deleted ${person.name}`)
      console.log("Deleted person:", res)
    })
    .catch(err => {
      setError(true)
      const msg = err.response.status === 404 ? `Information on ${person.name} by id ${id} not found.` : `Failed to delete ${person.name} for an unknown reason`
      setMessage(msg)
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
    Service.update(person)
    .then(res => {
      // Update state
      setPersons(persons.map(p => p.id !== person.id ? p : person))
      console.log("Updated person:", res)
    })
    .catch(err => {
      setError(true)
      setMessage(`Failed to update ${person.name}`)
      console.log(err)
    })
  }

  // Called by onSubmit if the person doesn't exist
  const createPerson = (person) => {
    Service.create(person)
    .then(res => {
      console.log("Created new person:", res)
      setPersons(persons.concat(person))
      setMessage(`Added ${person.name} to phonebook`)
    })
    .catch(err => {
      setError(true)
      setMessage(`Failed to create ${person.name}`)
      console.log(err)
    })
  }

  // Form submission logic
  const onSubmit = (event) => {
    event.preventDefault()

    // No empty entries, nothing else atm
    if (newName === '') {
      alert('Name cannot be empty')
      return
    }

    // Only numbers and dashes
    if (newNumber === '' || !/^[0-9-]*$/.test(newNumber)) {
      alert('Invalid number. Only numbers and dashes allowed.')
      return
    }

    // Set initial values
    setError(false)
  
    // If the person already exists, ask if user wants to update the number and return
    const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if (person !== undefined) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      person.number = newNumber
      updatePerson(person)

    // Don't allow duplicate numbers otherwise
    } else if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} number already in phonebook`)
      return

    } else {
      // Create a new record if the other criteria are not met with a unique id
      const newPerson = {
        name: newName,
        number: newNumber,
        // Get max id of persons array and add 1 to ensure a unique new index
        // Deletions will leave gaps in the id sequence so this fixes that, tho is a silly way to do it lmao.
        id: Math.max(...persons.map(p => p.id)) + 1 + ""
      }

      // Push new person to server and update state
      createPerson(newPerson)
    }

    // Set new states
    setNewName('')
    setNewNumber('')

    // Hide notification after 3 seconds
    setTimeout(() => {
      setMessage('')
    }, 3000)

  }

  // DOM

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error}/>

      <Filter filter={newFilter} filterHandler={filterHandler}/>

      <h3>Add a new contact</h3>

      <PersonForm callback={onSubmit} name={newName} nameHandler={nameHandler} number={newNumber} numHandler={numHandler}/>

      <h3>Contact list</h3>

      <ContactList contacts={persons} filter={newFilter} func={deletePerson}/>

    </div>
  )
}


export default App