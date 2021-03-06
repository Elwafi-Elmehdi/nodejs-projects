const fs = require('fs')
const chalk = require('chalk')


// #########################################################################

const getNotes = function (){
 const notes = loadNotes()
 console.log(notes)
}

// #########################################################################

const removeNote = function (title) {
 var notes = loadNotes()
 const duplicatednotes = notes.filter(function (note) {
  return note.title === title
 })
 if (duplicatednotes.length !== 0) {
  var deletedNote = {}
  for(var i=0;i<notes.length;i++){
   if(notes[i].title === title)
    deletedNote = notes.splice(i,1)
  }
  saveNote(notes)
  console.log(chalk.red('Note removed : ')+ title)
 }else{
  console.log(chalk.yellow('Note does not existe!'))
 }
}
// #########################################################################

const findNote = function (title) {
 const notes = loadNotes()
 const duplicatednotes = notes.filter(function (note) {
  return note.title === title
 })

 if (duplicatednotes.length !== 0) {
  notes.forEach(element => {
   if(element.title === title)
     console.log(element)
  });
 } else {
  console.log(chalk.yellow('Note does not existe!'))
 }
}
// #########################################################################
const addNote = function (title,body) {

 var notes = loadNotes()
 const duplicatednotes = notes.filter(function (note) {
  return note.title === title
 })
 if (duplicatednotes.length === 0) {
  notes.push({
   title: title,
   body:body
  })
  saveNote(notes)
  console.log(chalk.green('Note Added'))
 } else {
  console.log(chalk.red('Note title taken'))
 }

}
// #########################################################################

const saveNote = function (notes) {

 const dataJSON = JSON.stringify(notes)
 fs.writeFileSync('notes.json',dataJSON)

}
// #########################################################################

const loadNotes = function () {

 try {
  const dataBuffer = fs.readFileSync('notes.json');
  const dataJSON = dataBuffer.toString()
  return JSON.parse(dataJSON)
 }
 catch (e) {
  return []
 }

}
// #########################################################################

module.exports = {
 getNotes:getNotes,
 addNote:addNote,
 removeNote:removeNote,
 findNote:findNote
}