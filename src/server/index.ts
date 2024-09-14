import express from 'express';
import next from 'next';
import { parse } from 'url';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './management/routes/authRoutes';
import connectDB from './management/config/db';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  connectDB();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));
  server.use(passport.initialize());
  server.use(passport.session());

  server.use('/api/auth', authRoutes);

  server.get('/api/status', (req, res) => {
    // this should return server status and mongodb status
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