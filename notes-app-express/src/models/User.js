const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Note = require('./Note')
const conts = require('../consts/security')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        maxlength:8,
        minlength:2
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        maxlength:8,
        minlength:2
    },
    email:{
        unique:true,
        required:true,
        trim:true,
        type:String,
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    tokens: [{
        token:{
            type:String
        }
    }],
},{
    timestamps: true,
})

userSchema.methods.generateToken = async function(next) {
    const user = this
    const token = await jwt.sign({_id:user._id.toString()},conts.signature,{expiresIn: conts.tokenExpiration})
    return token
    next()
}

userSchema.statics.findByCredentials = async (email,pwd) => {
    const user  = await User.findOne({email:email})
    if(!user){
        throw new Error("Email not found")
    }
    const isMatch = await bcrypt.compare(pwd,user.password)
    if(!isMatch){
        throw new Error('Password is incorrect')
    }
    return user
}

userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        const password = user.password
        const encodedPassword = await bcrypt.hash(password,8)
        user.password = encodedPassword
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Note.deleteMany({owner:user._id})
    next()
})

const User =  mongoose.model('User',userSchema)

module.exports = User
