import express from 'express'
import { ForumController } from '../controller/forum-controller.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'

export const router = express.Router()

const controller = new ForumController()

const authenticateJWT = (req, res, next) => {
    try {
      const [authencate, token] = req.headers.authorization?.split(' ')
      const publickey = fs.readFileSync(process.env.ACCESS_TOKEN_PUBLIC)
  
      if (authencate !== 'Bearer') {
        throw new Error('Invalid authentication scheme.')
      }
  
      const payload = jwt.verify(token, publickey)
  
      req.user = {
        username: payload.sub
      }
      next()
    } catch (error) {
        console.log(error)
      const err = createError(401)
      next(err)
    }
  }

router.post('/newtopic', authenticateJWT, (req, res, next) => controller.addPost(req, res, next))
router.get('/topics/:topic/:theme', (req, res, next) => controller.getPosts(req, res, next))


router.delete('/posts/:postid', authenticateJWT, (req, res, next) => controller.deletePosts(req, res, next))
router.put('/posts/:postid', authenticateJWT, (req, res, next) => controller.updatePost(req, res, next))

router.post('/newtopic/:postid', authenticateJWT, (req, res, next) => controller.addComment(req, res, next))