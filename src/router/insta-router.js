import express from 'express'
import { InstaController } from '../controller/insta-api-controller.js'

export const router = express.Router()

const controller = new InstaController()

router.post('/callback', (req, res, next) => controller.callback(req, res, next))

