import express, { Request, Response } from "express";
import dotenv from "dotenv";
import session from 'express-session';
import passport from 'passport';
import './utils/passport';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, 
      secure: false, // true in production with HTTPS
      sameSite: 'lax', // or 'none' if using HTTPS cross-site
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    }
  }),
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/api/auth', authRoutes);



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

