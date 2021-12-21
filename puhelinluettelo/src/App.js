import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const Person = ({person}) => (
    <li>
      {person.name}
    </li>
  )


  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    console.log("addPerson event info: ", event)
    const personObject = {
      name: newName
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map((person, idx) => <Person key={idx} person={person}/>)}
      </ul>
    </div>
  )

}

export default App