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

  
 

   /**
   * Login the user.
   *
   * @param {object} req the request object.
   * @param {object }res responese object.
   * @param  {Function} next the next function.
   */
   async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.user, req.body.password)
      //const privatekey = fs.readFileSync(process.env.ACCESS_TOKEN_SECRET)

     
        const accsesstoken = jwt.sign(await this.signPayload(user), process.env.ACCESS_TOKEN_SECRET, {
          algorithm: 'RS256',
          expiresIn: process.env.ACCESS_TOKEN_LIFE
        })

        res.status(201).json({
          accsess_token: accsesstoken,
          message: 'Du är inloggad'
          
        })
      
    } catch (error) {
      error = createError(401)
      next(error)
    }

  }
  


  /**
   * Sign normal paylaod.
   *
   * @param {object} user the user object.
   */
  async signPayload (user) {
    const payload = {
      sub: user.username,
      mail: user.mailadress

    }
    return payload
  }

 
  

  
}
