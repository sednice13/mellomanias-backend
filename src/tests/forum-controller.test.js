
import request from 'supertest'
import {jest} from '@jest/globals'
import { ForumController } from '../controller/forum-controller.js'
import { Topic } from '../models/topic.js'

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}


const forumController = new ForumController()

describe('ForumController', () => {
  describe('addPost', () => {
    it('should successfully add a post if category and theme are valid', async () => {
      const req = { body: { category: 'eurovision', maintheme: 'music' }, user: { username: 'user1' } }
      const res = mockResponse()
      jest.spyOn(Topic.prototype, 'save').mockResolvedValue({ _id: '123', ...req.body })

      await forumController.addPost(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Topic added successfully'
      }))
    })

    it('should return a 400 error if the category is invalid', async () => {
      const req = { body: { category: 'invalid', maintheme: 'music' } }
      const res = mockResponse()

      await forumController.addPost(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Bad request: Invalid category or theme' })
    })
  })

  describe('checkCategory', () => {
    it('returns true for a valid category', () => {
      expect(forumController.checkCatagory('eurovision')).toBeTruthy()
    })

    it('returns false for an invalid category', () => {
      expect(forumController.checkCatagory('rock')).toBeFalsy()
    })
  })

  describe('checkMainTheme', () => {
    it('returns true for a valid theme', () => {
      expect(forumController.checkMainTheme('music')).toBeTruthy()
    })

    it('returns false for an invalid theme', () => {
      expect(forumController.checkMainTheme('food')).toBeFalsy()
    })
  })


})

