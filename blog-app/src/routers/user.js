const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

router.get("/", auth, (req, res) => {
	return res.send({ user: req.user, token: req.token });
});

router.get("/users/me", auth, async (req, res) => {
	try {
		res.send(req.user);
	} catch (error) {
		res.status(401).send();
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		const user = req.user;
		await user.delete();
		res.send(user);
	} catch (error) {
		res.status(401).send();
	}
});

router.post("/users", async (req, res) => {
	try {
		const user = new User({ ...req.body });
		await user.save();
		res.send(user);
	} catch (error) {
		console.log(error);
		res.status(400).send();
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send();
		}
		const user = await User.login(email, password);
		const token = user.generateJWT();
		res.send({ user, token });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = router;
