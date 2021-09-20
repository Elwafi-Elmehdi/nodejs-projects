const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bycrpt = require("bcryptjs");

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

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bycrpt.hash(
			user.password,
			parseInt(process.env.PASSWORD_SALT)
		);
	}
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
	const isMatch = bycrpt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Bad Credentials");
	}
	return user;
};

userSchema.methods.generateJWT = function () {
	const user = this;
	const token = jwt.sign(
		{ _id: user._id.toString() },
		process.env.JWT_SIGNATURE,
		{
			algorithm: process.env.JWT_ALGO,
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
	return token;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
