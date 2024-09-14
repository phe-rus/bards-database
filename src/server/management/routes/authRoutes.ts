// src/routes/authRoutes.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email is already in use' });
        }

        // Create a new user
        const user = new User({
            email,
            password,
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({
            msg: 'User registered successfully',
        });
    } catch (error) {
        res.status(400).json({
            error: error || 'An error occurred during registration',
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).exec(); // Ensure the result is a User document
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                msg: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({
            msg: 'User not found'
        });

        res.status(200).json({
            email: user.email,
            uid: user._id
        });
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }
});

export default router;
