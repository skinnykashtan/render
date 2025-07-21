const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch(error => {
        console.log('error connecting to mongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
  content: String,
  createdAt: {type:Date, default:Date.now},
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Note', noteSchema)