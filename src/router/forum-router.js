import express from 'express'
import { ForumController } from '../controller/forum-controller.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'

export const router = express.Router()

const controller = new ForumController()

const authenticateJWT = (req, res, next) => {
  try {
      const authHeader = req.headers.authorization
      
      if (!authHeader) {
          throw new Error('Not logged in')
      }

      const [authScheme, token] = authHeader.split(' ')

      if (authScheme !== 'Bearer') {
          throw new Error('Invalid authentication scheme')
      }

      const publicKey = fs.readFileSync(process.env.ACCESS_TOKEN_PUBLIC)

      jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) {
              if (err.name === 'TokenExpiredError') {
                  throw new Error('Token expired')
              } else {
                  throw new Error('Token invalid')
              }
          }

          req.user = {
              username: decoded.sub
          }

          next()
      })
  } catch (error) {
      console.log(error.message)
      if (error.message === 'Not logged in') {
          res.status(401).json({ message: 'You are not logged in. Please log in and try again.' })
      } else if (error.message === 'Token expired') {
          res.status(401).json({ message: 'Your session has expired. Please log out and log in again.' })
      } else if (error.message === 'Token invalid') {
          res.status(401).json({ message: 'Invalid token. Please log in and try again.' })
      } else if (error.message === 'Invalid authentication scheme') {
          res.status(401).json({ message: 'Invalid authentication scheme. Please use Bearer authentication.' })
      } else {
          const err = createError(401)
          next(err)
      }
  }
}

router.post('/newtopic', authenticateJWT, (req, res, next) => controller.addPost(req, res, next))
router.get('/topics/:topic/:theme', (req, res, next) => controller.getPosts(req, res, next))


router.delete('/posts/:postid', authenticateJWT, (req, res, next) => controller.deletePosts(req, res, next))
router.put('/posts/:postid', authenticateJWT, (req, res, next) => controller.updatePost(req, res, next))

router.post('/newtopic/comments', authenticateJWT, (req, res, next) => controller.addComment(req, res, next))

router.get('/newtopic/:postid/comments',  (req, res, next) => controller.getComments(req, res, next))
router.get('/newtopic/:postid',  (req, res, next) => controller.getPost(req, res, next))
router.put('/comments/:commentid', authenticateJWT, (req, res, next) => controller.updateComment(req,res, next))
router.delete('/comments/:commentid', authenticateJWT, (req, res, next) => controller.deleteComment(req,res, next))