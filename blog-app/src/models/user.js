const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Post = require("../models/post");

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
		},
		age: {
			type: Number,
			required: true,
			validate(age) {
				if (age <= 0) {
					throw new Error("Age is not valid.");
				}
			},
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		phone: {
			type: String,
			max: 10,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "owner",
});

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(
			user.password,
			parseInt(process.env.PASSWORD_SALT)
		);
	}
	next();
});

userSchema.pre("remove", async function (next) {
	const user = this;
	const isRemoved = await Post.deleteMany({ owner: user._id });
	next();
});

userSchema.methods.toJSON = function () {
	const user = this;
	const vo = user.toObject();
	delete vo.password;
	return vo;
};

userSchema.statics.login = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("User not found");
	}
	const isMatch = bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Bad Credentials");
	}
	return user;
};

userSchema.methods.generateJWT = function () {
	const user = this;
	try {
		const token = jwt.sign(
			{ _id: user._id.toString() },
			process.env.JWT_SIGNATURE,
			{
				expiresIn: process.env.JWT_EXPIRE,
			}
		);
		return token;
	} catch (error) {
		console.log(error);
	}
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
