import React, { useState, useEffect } from 'react'
import axios from 'axios'

// 2.11

const Filter = ({filter, filterHandler}) => (
  <div>
    Filter: <input value={filter} onChange={filterHandler}/>
  </div>
)

const Person = ({person}) => (
  <li>
    {person.name} {person.number}
  </li>
)

const Contacts = ({contacts, filter}) => (
  <ul>
    {contacts.filter(v => v.name.toLowerCase().includes(filter.toLowerCase()))
            .map((person) => <Person key={'person'+person.id} person={person}/>)}
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
  
  // States
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  useEffect(() => {
    console.log('effect triggered')
    axios.get('http://localhost:3001/persons')
    .then(res => setPersons(res.data))
    .catch(console.log)
  }, [])

  const nameHandler = (event) => {
    setNewName(event.target.value)
  }

  const numHandler = (event) => {
    setNewNumber(event.target.value)
  }
  
  const filterHandler = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
  
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} name already in phonebook`)
      return
    }
  
    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} number already in phonebook`)
      return
    }
  
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')

    axios.post('http://localhost:3001/persons', personObject)
         .then(console.log)
         .catch(console.log)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={newFilter} filterHandler={filterHandler}/>

      <h3>Add a new contact</h3>

      <PersonForm callback={addPerson} name={newName} nameHandler={nameHandler} number={newNumber} numHandler={numHandler}/>

      <h3>Contact list</h3>

      <Contacts contacts={persons} filter={newFilter}/>

    </div>
  )
}

export default App