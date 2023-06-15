const express = require("express")
const router = express.Router()
const postsRouter = require('./posts.js')
const commentRouter = require('./comments.js')

router.use("/api",[postsRouter,commentRouter])

module.exports = router;