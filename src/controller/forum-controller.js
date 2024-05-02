import { Topic } from '../models/topic.js'

export class ForumController {
    /**
     * Adds a new topic.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     */
    async addPost(req, res) {
        try {
            if (this.checkCatagory(req.body.catagory) && this.checkMainTheme(req.body.theme)) {
                await this.saveTopic(req, res)
            } else {
                res.status(400).json({ error: 'Bad request: Invalid category or theme' })
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to add topic' })
        }
    }

    /**
     * Checks if the category is valid.
     * @param {string} catagory - The category to check.
     * @returns {boolean} - True if valid, false otherwise.
     */
    checkCatagory(catagory) {
        const eurovision = 'eurovision'
        const melo = 'melodifestivalen'
        return catagory === eurovision || catagory === melo
    }

    /**
     * Checks if the main theme is valid.
     * @param {string} theme - The main theme to check.
     * @returns {boolean} - True if valid, false otherwise.
     */
    checkMainTheme(theme) {
        const general = 'general'
        const mucic = 'music'
        const artists = 'artists'
        return theme === general || theme === mucic || theme === artists
    }

    /**
     * Saves a new topic.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     */
    async saveTopic(req, res) {
        try {
            const { catagory, maintheme, title, text } = req.body
            const username = req.user.username // Extract the username from the authenticated user

            const newTopic = new Topic({
                username,
                catagory,
                maintheme,
                title,
                text
            })

            const savedTopic = await newTopic.save()
            res.status(201).json({ message: 'Topic added successfully', topic: savedTopic })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to save topic' })
        }
    }
}