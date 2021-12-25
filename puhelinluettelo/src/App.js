import React, { useState } from 'react'

// 2.10

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
            .map((person, idx) => <Person key={'person'+idx} person={person}/>)}
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

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
      alert(`${newName} already in phonebook`)
      return
    }
  
    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} already in phonebook`)
      return
    }
  
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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