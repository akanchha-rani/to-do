const express = require('express');
const app = express(); 
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get('/', (req,res) => {
    res.render('index');
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.get('/profile', isLoggedIn, (req,res) => {
    console.log(req.user);
    res.render('login');
});

app.post('/register', async(req,res) => {
    let { email, username, password, name, age } = req.body;

    let user = await userModel.findOne({email: email});
    if(user) return res.status(500).send("user already registered");
    
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                name,
                password: hash,
                age,
                email
            });
            let token = jwt.sign({email: email, userid: user._id}, "shhshh");
            res.cookie("token", token);
            res.send("registered");
        });
    });
});

app.listen(3000, () => {
    console.log('Server Working');
});