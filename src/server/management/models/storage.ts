import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination folder for uploads
        const uploadPath = path.join(__dirname, 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|gif|webp|mp4|avi/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('File type not allowed'));
        }
    }
});

// API endpoint to upload files
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Get the file's URL (for local storage example)
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.status(200).json({
            msg: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// API endpoint to create folders (optional, not used directly here)
router.post('/folder', (req, res) => {
    const { folderPath } = req.body;
    // Validate and create folder
    // Example of folder creation using fs (File System) module
    const fs = require('fs');
    const fullPath = path.join(__dirname, 'uploads', folderPath);

    fs.mkdir(fullPath, { recursive: true }, (err: any) => {
        if (err) {
            console.error('Error creating folder:', err);
            return res.status(500).json({ msg: 'Error creating folder' });
        }

        res.status(200).json({ msg: 'Folder created successfully' });
    });
});

export default router;