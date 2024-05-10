import { Topic } from '../models/topic.js'

export class ForumController {
    /**
     * Adds a new topic.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     */
    async addPost(req, res) {
        try {
            if (this.checkCatagory(req.body.catagory) && this.checkMainTheme(req.body.maintheme)) {
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
            const username = req.user.username

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

    async getPosts(req, res) {
        try {
            const { topic, theme } = req.params
            const { page = 1 } = req.query // Default page is 1
            const limit = 3 // Limit to 3 posts per page
            const skip = (page - 1) * limit

            // Fetch the filtered and paginated topics
            const posts = await Topic.find({ catagory: topic, maintheme: theme })
                .skip(skip)
                .limit(limit)

            // Calculate the total number of pages
            const totalPosts = await Topic.countDocuments({ catagory: topic, maintheme: theme })
            const totalPages = Math.ceil(totalPosts / limit)

            res.status(200).json({
                posts,
                totalPages,
                currentPage: parseInt(page),
            })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to fetch topics' })
        }
    }

    async deletePosts(req, res) {

        try {
            const post = await Topic.findById(req.params.postid) 
            if (!post) {
                return res.status(404).json({ error: 'Post not found' })
            }

            if(req.user.username != post.username) {
          
                return res.stauts(404).json({error: 'not right user'})

            }
    
            await post.remove() 
            res.status(200).json({ message: 'Post deleted successfully' }) 
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to delete post' }) 
        }

    }
}