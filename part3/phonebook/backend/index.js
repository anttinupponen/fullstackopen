const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
if (process.env.NODE_ENV !== 'development') {
	app.use(express.static('dist')) // production build
}

// 3.22
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response, next) => {
	Person.find({}).then(persons => {
		const length = persons.length
		const date = new Date()
		response.send(`<p>Phonebook has info for ${length} people</p><p>${date}</p>`)
	})
	.catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
	Person.find({}).then(persons => {
		response.status(200).json({
			message: "Persons fetched.",
			body: persons
		})
	})
	.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	if (!id) {
		response.status(400).json({
			error: "Id missing."
		})
		return
	}
	Person.findById(id).then(person => {
		if (person) {
			response.status(200).json({
				message: "Found person",
				body: person
			})
		} else {
			response.status(404).end()
		}
	})
	.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	const person = request.body
	Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
		response.status(200).json({
			message: "Updated person",
			body: updatedPerson
		})
	})
	.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
	console.log("POST request received:", body)
  if (!body) {
    response.status(400).json({
      error: "Content missing."
    })
		return
  } else if (!body.number || !body.name || body.number === "" || body.name === "") {
		response.status(400).json({
			error: "Name or number missing.",
			body: body
		})
		return
	}

	console.log("Checking if name exists...")
	// Fetch all persons and check if name exists
  Person.findOne({ name: body.name })
		.then(existingPerson => {
			if (existingPerson) {
				console.log("Name already exists, returning 409...")
				response.status(409).json({
					error: 'Person already exists.',
					body: existingPerson
				})
				return
			}

			console.log("Name does not exist, creating new person...")
			const person = new Person({
				name: body.name,
				number: body.number
			})

			person.save({ runValidators: true, context: 'query' })
				.then(savedPerson => response.status(201).json({
					message: "Created new person",
					body: savedPerson
				}))
			.catch(error => next(error))
		})
		.catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	if (!id) {
    response.status(400).json({
      error: "Id missing."
    })
		return
  }
	Person.findByIdAndDelete(id).then(person => {
		if (person) {
			response.status(200).json({
				message: "Deleted",
				body: person
			})
		} else {
			response.status(404).json({
      	error: "Person not found in phonebook."
			})
		}
	})
	.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: "Unknown endpoint." })
}
app.use(unknownEndpoint)

// Error handling middleware
// the fourth parameter is required for this to work, even if it would be unused.
const errorHandler = (error, request, response, next) => {
	console.error(error.message, error.name)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: "Malformatted id." })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})