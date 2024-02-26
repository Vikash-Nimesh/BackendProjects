const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator')
const Note = require('../models/Note')

//ROUTE 1 : Get all notes using GET : '/api/notes/fetchallnotes'. Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)
  } catch (error) {
    console.log(error.message)
    return res.status(401).send('Some error in retrieving notes')
  }
})

//ROUTE 2 : Add a new note using POST : '/api/notes/newnote'. Login Required
router.post(
  '/newnote',
  fetchuser,
  [
    body('name', 'Enter a valid title').exists(),
    body('description', 'Enter a valid description').exists()
  ],
  async (req, res) => {
    //If there are errors, return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, tags } = req.body

    try {
      const note = new Note({
        name,
        description,
        tags,
        user: req.user.id
      })

      const saveNote = await note.save()
      res.json(saveNote)
    } catch (error) {
      console.log(error.message)
      return res.status(401).send('Some error in creating notes')
    }
  }
)

//ROUTE 3 : Update a note using PUT : '/api/notes/updatenote'. Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    const { name, description, tags } = req.body
    const newNote = {}
    if (name) {
      newNote.name = name
    }
    if (description) {
      newNote.description = description
    }
    if (tags) {
      newNote.tags = tags
    }

    let note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).send('Not Found')
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed')
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    )
    res.json({ note })
  } catch (error) {
    console.log(error.message)
    return res.status(401).send('Some error in updating note')
  }
})

//ROUTE 4 : Deleting a note using DELETE : '/api/notes/deletenote'. Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).send('Not Found')
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed')
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ sucess: 'Note has been deleted', note: note })
  } catch (error) {
    console.log(error.message)
    return res.status(401).send('Some error in deleting note')
  }
})

//ROUTE 4 : Searching a note using GET : '/api/notes/searchnote'. Login Required
router.get('/searchnote/:search_query', fetchuser, async (req, res) => {
  try {
    let notes = await Note.find({
      user: req.user.id,
      name:{$regex: req.params.search_query, $options: 'i'} 
    })

    if (notes.length==0) {
      return res.status(404).send('Not Notes Found')
    }

    console.log(notes)
    res.json(notes)

    // notes = await Note.find({email: { $regex: req.params.search_query }})
    // res.json({ sucess: 'Note has been deleted', note: note })
  } catch (error) {
    console.log(error.message)
    return res.status(401).send('Some error in searching note')
  }
})

//ROUTE 5 : Searching a note using GET : '/api/notes/deleteallnotes'. Login Required
router.delete('/deleteallnotes', fetchuser, async (req, res) => {
  try {
    let notes = await Note.find({ user: req.user.id })
    if (!notes) {
      return res.status(404).send('No Notes Found')
    }

    notes = await Note.deleteMany()
    res.json({ success: 'All Notes Deleted' })
  } catch (error) {
    console.log(error.message)
    return res.status(401).send('Some error in searching note')
  }
})

module.exports = router
