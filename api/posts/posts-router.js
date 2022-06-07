// implement your posts router here
const Posts = require('./posts-model');
const express = require('express');

const router = express.Router();

// POSTS ENDPOINTS BELOW

// [GET] /api/posts
router.get('/', (req,res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: 'The posts information could not be retrieved' })
        })
})

// [GET] /api/posts/:id
router.get('/:id', (req,res) => {
    Posts.findById(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: 'The post information could not be retrieved' })
        })
})

// [GET] /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            if (comments.length > 0) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'The comments information could not be retrieved' })
        })
})

// [POST] /api/posts
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else {
        Posts.insert({ title, contents })
            .then(({ id }) => {
                return Posts.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: 'There was an error while saving the post to the database' })
            })
    }
})

// [PUT] /api/posts/:id
router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else {
        Posts.findById(req.params.id)
            .then(id => {
                if (!id) {
                    res.status(404).json({ message: 'The post with the specified ID does not exist' })
                } else {
                    return Posts.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Posts.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: 'The posts information could not be retrieved' })
            })
    }
})

// [DELETE] /api/posts/:id
router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist',
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The post could not be removed',
            err: err.message,
            stack: err.stack,
        })
    }
})


// export
module.exports = router;