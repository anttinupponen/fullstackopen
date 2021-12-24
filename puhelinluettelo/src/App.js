import React, { useState } from 'react'

// 2.8

const App = () => {
  const [ persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '050-020202'
    }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

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

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameInputChange}
          />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberInputChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map((person, idx) => <Person key={'person'+idx} person={person}/>)}
      </ul>
    </div>
  )

}

export default App