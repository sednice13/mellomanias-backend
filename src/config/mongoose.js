import mongoose from 'mongoose'

/**
 * Connect to data base.
 *
 * @returns {Promise} If connecttion is succesful.
 */
export const connectToDatabase = async () => {
  const { connection } = mongoose

  connection.on('connected', () => console.log('MongoDB connection opened.'))
  connection.on('error', (err) => console.error(`MongoDB connection error occurred: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'))

  process.on('SIGINT', () => {
    connection.close(() => {
      console.log('MongoDB disconnected due to application termination.')
      process.exit(0)
    })
  })

  console.log('PROCESS:' + process.env.DB_CONNECTION_STRING)

  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}
