import { Comment } from '../models/comment.js'
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
            const { page = 1 } = req.query 
            const limit = 3
            const skip = (page - 1) * limit

            
            const posts = await Topic.find({ catagory: topic, maintheme: theme })
                .skip(skip)
                .limit(limit)

            
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

    async updatePost(req, res) {
        try {
            const post = await Topic.findById(req.params.postid) 
            if (!post) {
                return res.status(404).json({ error: 'Post not found' })
            }
    
            if (req.user.username !== post.username) {
                return res.status(403).json({ error: 'Unauthorized: Cannot edit posts by other users' })
            }
    
            
            post.title = req.body.title || post.title
            post.text = req.body.text || post.text
    
            await post.save() 
            res.status(200).json({ message: 'Post updated successfully', updatedPost: post })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to update post' })
        }
    }


    async getPost(req, res) {
        try {
            const post = await Topic.findById(req.params.id)

            if(!post) {
                return res.status(404).json({ error: 'Post not found' })
            }
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: 'Server error' })
        }
    }

     async addComment(req, res) {
        try {
            if (this.checkCatagory(req.body.catagory) && this.checkMainTheme(req.body.maintheme)) {
                await this.saveComment(req, res)
            } else {
                res.status(400).json({ error: 'Bad request: Invalid category or theme' })
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to add Comment' })
        }
     }

     async saveComment(req, res) {
        try {
            const { catagory, maintheme, text } = req.body
            const username = req.user.username

            const newComment = new Comment({
                username,
                catagory,
                maintheme,
                text
            })

            const savedTopic = await newComment.save()
            res.status(201).json({ message: 'Comment added successfully', topic: savedTopic })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to save Comment' })
        }
    }

}