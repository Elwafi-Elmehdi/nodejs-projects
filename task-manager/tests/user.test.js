const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
    _id:user1Id,
    firstname:"Reda",
    lastname:"hihi",
    email:"hehe@ewhhew.hehe",
    password:"hehehe1777!",
    tokens:[{
        token:jwt.sign({_id:user1Id},process.env.JWT_TOKEN)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(user1).save()
})

test('Should register a new user',async () => {
    await request(app).post('/users/register').send({
        firstname:"Mehdi",
        lastname:"hihi",
        email:"hehe@hehe.hehe",
        password:"hehehe1777!",
    }).expect(201)
})

test('Should login a user',async () => {
    await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)
})

test('Should not login unkown user',async () => {
    await request(app).post('/users/login').send({
        email: user1.email,
        password: "passsqw7784@"
    }).expect(404)
})

test("Should get user profile",async () =>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})
