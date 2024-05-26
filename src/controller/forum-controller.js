import { Comment } from '../models/comment.js'
import { Topic } from '../models/topic.js'

/**
 * Controller for handling forum operations
 */
export class ForumController {
    /**
     * Adds a new post
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
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
     * Checks if the category is valid
     * @param {string} catagory - The category to check
     * @returns {boolean} - True if valid, false otherwise
     */
    checkCatagory(catagory) {
        const eurovision = 'eurovision'
        const melo = 'melodifestivalen'
        return catagory === eurovision || catagory === melo
    }

    /**
     * Checks if the main theme is valid
     * @param {string} theme - The theme to check
     * @returns {boolean} - True if valid, false otherwise
     */
    checkMainTheme(theme) {
        const general = 'general'
        const mucic = 'music'
        const artists = 'artists'
        return theme === general || theme === mucic || theme === artists
    }

    /**
     * Saves a new topic
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
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
            res.status(500).json({ message: 'Server error: Unable to save topic' })
        }
    }

    /**
     * Gets posts based on topic and theme
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
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
                currentPage: parseInt(page)
            })
        } catch (error) {
            res.status(500).json({ message: 'Server error: Unable to fetch topics' })
        }
    }

    /**
     * Deletes a post
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deletePosts(req, res) {
        try {
            const post = await Topic.findById(req.params.postid)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            if(req.user.username != post.username) {
                return res.status(403).json({ message: 'Unauthorized: Cannot delete posts by other users' })
            }

            await post.remove()
            res.status(200).json({ message: 'Post deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to delete post' })
        }
    }

    /**
     * Updates a post
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updatePost(req, res) {
        try {
            const post = await Topic.findById(req.params.postid)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            if (req.user.username !== post.username) {
                return res.status(403).json({ message: 'Unauthorized: Cannot edit posts by other users' })
            }

            post.title = req.body.title || post.title
            post.text = req.body.text || post.text

            await post.save()
            res.status(200).json({ message: 'Post updated successfully', updatedPost: post })
        } catch (error) {
            res.status(500).json({ message: 'Server error: Unable to update post' })
        }
    }

    /**
     * Gets a single post
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getPost(req, res) {
        try {
            const post = await Topic.findById(req.params.postid)
            if (!post) {
                return res.status(404).json({ error: 'Post not found' })
            }
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: 'Server error' })
        }
    }

    /**
     * Adds a new comment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async addComment(req, res) {
        try {
            if (this.checkCatagory(req.body.catagory) && this.checkMainTheme(req.body.maintheme)) {
                await this.saveComment(req, res)
            } else {
                res.status(400).json({ message: 'Bad request: Invalid category or theme' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error: Unable to add Comment' })
        }
    }

    /**
     * Saves a new comment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async saveComment(req, res) {
        try {
            const { catagory, maintheme, text } = req.body
            const username = req.user.username

            const newComment = new Comment({
                username,
                catagory,
                maintheme,
                topicid: req.body.topicid,
                text
            })

            const savedTopic = await newComment.save()
            res.status(201).json({ message: 'Comment added successfully', topic: savedTopic })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to save Comment' })
        }
    }

    /**
     * Gets comments for a post
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getComments(req, res) {
        try {
            const { page = 1 } = req.query
            const limit = 3
            const skip = (page - 1) * limit

            const comments = await Comment.find({ topicid: req.params.postid })
                .skip(skip)
                .limit(limit)

            const totalPosts = await Comment.countDocuments({ topicid: req.params.postid })
            const totalPages = Math.ceil(totalPosts / limit)
            if (!comments) {
                return res.status(404).json({ message: 'No comments exist' })
            }
            res.status(200).json({
                comments,
                totalPages,
                currentPage: parseInt(page)
            })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to get comments' })
        }
    }

    /**
     * Updates a comment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateComment(req, res) {
        try {
            const comment = await Comment.findById(req.params.commentid)
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' })
            }

            if (req.user.username !== comment.username) {
                return res.status(403).json({ error: 'Unauthorized: Cannot edit comments by other users' })
            }

            comment.text = req.body.text || comment.text

            await comment.save()
            res.status(200).json({ message: 'Comment updated successfully', updatedComment: comment })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to update comment' })
        }
    }

    /**
     * Deletes a comment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteComment(req, res) {
        try {
            const comment = await Comment.findById(req.params.commentid)
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' })
            }

            if (req.user.username !== comment.username) {
                return res.status(403).json({ message: 'Unauthorized: Cannot delete comments by other users' })
            }

            await comment.remove()
            res.status(200).json({ message: 'Comment deleted successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Server error: Unable to delete comment' })
        }
    }
}
