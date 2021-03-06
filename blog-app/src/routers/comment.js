const express = require("express")
const router = new express.Router();
const auth = require("../middleware/auth");
const Comment = require("../models/comment");

router.get("/comments/post/:id", async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).send();
		}
		const comments = await Comment.find({ post: id });
		res.send(comments);
	} catch (error) {
		res.status(500).send();
	}
});

router.post("/comments/post/:id", auth, async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).send();
		}
		const comment = Comment({ ...req.body, owner: req.user._id, post: id });
		await comment.save();
		res.send(comment);
	} catch (error) {
		res.status(500).send();
	}
});

module.exports = router;
