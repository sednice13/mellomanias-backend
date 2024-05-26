import express from 'express'
import { router as accountRouter } from './account-router.js'

import {router as forumRouter} from './forum-router.js'


export const router = express.Router()

router.use('/user', accountRouter)

router.use('/forum', forumRouter)

