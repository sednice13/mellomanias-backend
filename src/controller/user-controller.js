/* eslint-disable no-undef */
/* eslint-disable no-ex-assign */
import { User } from '../models/user.js'

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import fs from 'fs'
import fetch from 'node-fetch'

/**
 *
 */
export class UserContoller {
  /**
   * Sign in user (register).
   *
   * @param {object} req the request object.
   * @param {object} res the respone object.
   * @param {Function} next the next function.
   */
  async Register (req, res, next) {
    try {
      const user = new User({

        username: req.body.user,
        password: req.body.password,
        mailadress: req.body.mail

      })

      if (!await this.checkIfUserExist(user.mailadress)) {
        await user.save()

        res.status(201).json({
          message: 'succsess'
        })
      } else {
        next(createError(409))
      }
    } catch (error) {
      next(error)
    }
  }

  

  /**
   * Check if user exist.
   *
   * @param {object} mail the request object.
   */
  async checkIfUserExist (mail) {
    const mailadress = await User.findOne({ mailadress: mail })

    if (mailadress) {
      return true
    } else {
      return false
    }
  }

  
 

  
  

  
}
