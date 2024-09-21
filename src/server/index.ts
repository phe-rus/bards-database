import express from 'express';
import next from 'next';
import { parse } from 'url';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import client from './management/config/db';
import authen from './management/models/authen';
import mongobase from './management/models/mongobase';
import path from 'path';
import storage from './management/models/storage';
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  client.connect();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
  server.use(passport.initialize());
  server.use(passport.session());


  server.use('/api/auth', authen);
  server.use('/api/dbs', mongobase)
  // upload path from public folder
  server.use('/uploads', express.static(path.join(__dirname, 'public')))
  server.use('/api/uploads', storage)

  server.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'ok' });
  })

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url!, true)
    return handle(req, res, parsedUrl)
  })

  server.listen(port, () => {
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
  })
});