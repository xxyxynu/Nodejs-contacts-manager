const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            message: 'User created successfully',
            _id: user.id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('User could not be created');
    }

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Please provide all required fields' });
        throw new Error('Please provide all required fields');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id
                }
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ accessToken: token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.json({ user: req.user });
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
};