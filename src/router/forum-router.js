import express from 'express'
import { ForumController } from '../controller/forum-controller.js'

export const router = express.Router()

const controller = new ForumController()

const authenticateJWT = (req, res, next) => {
    try {
      const [authencate, token] = req.headers.authorization?.split(' ')
      const publickey = fs.readFileSync(process.env.ACCESS_TOKEN_SECRET)
  
      if (authencate !== 'Bearer') {
        throw new Error('Invalid authentication scheme.')
      }
  
      const payload = jwt.verify(token, publickey)
  
      req.user = {
        username: payload.sub
      }
      next()
    } catch (error) {
      const err = createError(401)
      next(err)
    }
  }

router.post('/newtopic', authenticateJWT, (req, res, next) => controller.addPost(req, res, next))