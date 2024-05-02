import mongoose from 'mongoose'


const schema = new mongoose.Schema({

  username: {

    type: String,
    required: true,
    minlength: 8
  },
 catagory: {

    type: String,
    required: true
 },
 maintheme: {
    type: String,
    required: true
 }, 
 title: {
    type: String,
    required: true
 },
 text: {
    type: String,
    required: true
 }

}

)


export const Topic = mongoose.model('Topic', schema)
