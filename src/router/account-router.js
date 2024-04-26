import express from 'express'
import { UserContoller } from '../controller/user-controller.js'
export const router = express.Router()

const controller = new UserContoller()

router.post('/register', (req, res, next) => controller.Register(req, res, next))

//router.post('/login', (req, res, next) => controller.login(req, res, next))


