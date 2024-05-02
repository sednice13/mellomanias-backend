import express from 'express'
import { router as accountRouter } from './account-router.js'
import { router as instaRouter} from './insta-router.js'
import {router as forumRouter} from './forum-router.js'


export const router = express.Router()

router.use('/user', accountRouter)
router.use('/insta', instaRouter)
router.use('/forum', forumRouter)

