import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new mongoose.Schema({

  username: {

    type: String,
    required: true,
    minlength: 8
  },
  password: {

    type: String,
    required: true,
    minlength: 10
  },

  mailadress: {
    type: String,
    required: true,
    minlength: 1

  }

}

)

schema.pre('save', async function () {
  console.log(this.password)
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Authenticate part.
 *
 * @param {string} username The username.
 * @param  {string} password The password.
 * @returns {object} The object.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('failed login')
  }

  return user
}

export const User = mongoose.model('User', schema)
