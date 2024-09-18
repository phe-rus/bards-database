import express from 'express';
import dotenv from 'dotenv';
import client from '../config/db';
import { MongoClient } from 'mongodb';

dotenv.config();
const router = express.Router();

router.get('/status', (req, res) => {
    // get mongodb client.connect() status
    try {

    } catch (error) {

    }
})

router.post('/add-address', async (req, res) => {
    const { mongoUrl, email } = req.body;
    try {
        // Connect to database
        const clientConnection = await client.connect();
        const db = clientConnection.db('bards-database');
        const collection = db.collection('users');

        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const dburl = await collection.findOne({ mongoUrl })
        // check its not empty if its empty add the mongoUrl to it , else if its not empty
        // check if the new url matches the url in database if it doesnt then update it
        // then if all this is fine is not empty and is match then return the database url instead
        if (!dburl) {
            await collection.updateOne({ email }, { $set: { mongoUrl } });
            return res.status(200).json({ msg: 'Mongo URL added successfully' });
        } else if (dburl.mongoUrl === mongoUrl) {
            return res.status(200).json({ msg: 'Mongo URL already exists' });
        } else {
            await collection.updateOne({ email }, { $set: { mongoUrl } });
            return res.status(200).json({ msg: 'Mongo URL updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error adding address' });
    }
})

// get the database url (POST request)
router.post('/geturl', async (req, res) => {
    const { email } = req.body;
    try {
        const clientConnection = await client.connect();
        const db = clientConnection.db('bards-database');
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if existingUser has mongoUrl
        if (existingUser.mongoUrl) {
            return res.status(200).json({ mongoUrl: existingUser.mongoUrl });
        } else {
            return res.status(404).json({ msg: 'Mongo URL not found for the user' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: 'Error getting URL' });
    }
});

router.post('/collections', async (req, res) => {
    const { mongoUrl, database } = req.body;

    if (typeof mongoUrl !== 'string') {
        return res.status(400).json({ msg: 'Invalid mongoUrl parameter' });
    }

    try {
        const client = new MongoClient(mongoUrl, {
            monitorCommands: true
        });

        await client.connect();

        const db = client.db(database as string);
        const collections = await db.collections();  // Get all collections

        // Fetch documents for each collection
        const collectionsWithDocuments = await Promise.all(
            collections.map(async (collection) => {
                const documents = await collection.find({}).toArray();  // Fetch all documents
                return {
                    collectionName: collection.collectionName,
                    documents: documents
                };
            })
        );

        // Close the client connection
        await client.close();

        return res.status(200).json(collectionsWithDocuments);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: `Error getting collections: ${error}` });
    }
});

router.get('/listdatabases', async (req, res) => {
    const { mongoUrl } = req.query;

    if (typeof mongoUrl !== 'string') {
        return res.status(400).json({ msg: 'Invalid mongoUrl parameter' });
    }

    try {
        // Create a new MongoClient instance with the provided mongoUrl
        const client = new MongoClient(mongoUrl,
            {
                monitorCommands: true
            });
        await client.connect();

        // List databases
        const databases = await client.db().admin().listDatabases();
        // Get more details for each database
        const result = await Promise.all(databases.databases.map(async (db) => {
            const dbConnection = client.db(db.name);

            // Get database stats (size, collection count, etc.)
            const stats = await dbConnection.stats();
            const collections = await dbConnection.listCollections().toArray();

            const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2); // for MB
            const bytesToGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2); // for GB

            return {
                name: db.name,
                sizeOnDisk: db.sizeOnDisk as number > 1024 * 1024 * 1024
                    ? `${bytesToGB(db.sizeOnDisk as number)} GB`
                    : `${bytesToMB(db.sizeOnDisk as number)} MB`, // size in MB
                empty: db.empty,
                collectionsCount: collections.length, // count of collections
                totalDocuments: stats.objects, // total documents in the database
                avgObjSize: stats.avgObjSize, // average object size
                indexes: stats.indexes, // total indexes
            };
        }));

        // Close the client connection
        await client.close();

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ msg: `Error getting databases: ${error}` });
    }
});

export default router;