import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import client from '../config/db';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

dotenv.config();
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || '';

type UserData = {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    username?: string; // Optional property
}

router.post('/create', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await client.connect();
        const db = user.db('bards-database');
        const collection = db.collection('users');

        // Check for existing user
        const existingUser = await collection.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Invalid email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const userData: UserData = {
            email: email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        if (username) {
            userData.username = username;
        }

        await collection.insertOne(userData);

        res.status(200).json({ msg: 'Account created successfully!!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Connect to database
        const clientConnection = await client.connect();
        const db = clientConnection.db('bards-database');
        const collection = db.collection('users');

        // Find user by email
        const existingUser = await collection.findOne({ email: email });

        if (!existingUser) {
            return res.status(400).json({ msg: 'Email does not exist' });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // Generate JWT
        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id,
        },
            jwtSecret,
            { expiresIn: '3h' }
        );
        // Send response with token
        res.status(200).json({
            token: token,
            msg: 'Logged in successfully!!'
        });
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/profile', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token provided or incorrect format' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Connect to database
        const clientConnection = await client.connect();
        const db = clientConnection.db('bards-database');
        const collection = db.collection('users');

        // Verify the token manually
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        //console.log('Decoded Token:', decoded); // For debugging

        // Fetch the user using the ID in the token payload
        const user = await collection.findOne({ _id: new ObjectId(decoded.id) });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Respond with user details
        res.status(200).json({
            email: user.email,
            uid: user._id,
            name: user.name,
            bio: user.bio,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ msg: 'Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: 'Invalid token' });
        } else {
            return res.status(500).json({ msg: 'Server error' });
        }
    }
});

router.put('/update', async (req, res) => {
    const { key, value } = req.body;
    const authHeader = req.headers.authorization;

    // Check for authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token provided or incorrect format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Connect to database
        const clientConnection = await client.connect();
        const db = clientConnection.db('bards-database');
        const collection = db.collection('users');

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const userId = decoded.id;

        // Find the user
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the user profile
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { [key]: value } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ msg: 'No changes made to the user profile' });
        }

        // Generate a new token
        const newToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.json({ token: newToken });

    } catch (error) {
        console.error('Token verification or update error:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ msg: 'Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ msg: 'Invalid token' });
        } else {
            return res.status(500).json({ msg: 'Server error' });
        }
    }
});

export default router;
