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
topicid: {
    type: String,
    required: true
},
 text: {
    type: String,
    required: true
 }

}

)


export const Comment = mongoose.model('Comment', schema)
