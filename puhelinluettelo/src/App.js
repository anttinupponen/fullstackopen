import React, { useState } from 'react'

// 2.9

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const Person = ({person}) => (
    <li>
      {person.name} {person.number}
    </li>
  )

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

    // console.log('button clicked', event.target)
    // console.log("addPerson event info: ", event)
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInputChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterInputChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        Filter: <input value={newFilter} onChange={handleFilterInputChange}/>
      </div>
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleNameInputChange}/>
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNumberInputChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.filter(v => v.name.toLowerCase().includes(newFilter.toLowerCase()))
                .map((person, idx) => <Person key={'person'+idx} person={person}/>)}
      </ul>
    </div>
  )

}

export default App