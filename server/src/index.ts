import express, { Request, Response } from "express";
import dotenv from "dotenv";
import session from 'express-session';
import passport from 'passport';
import './utils/passport';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/tasks.routes';
import cors from 'cors';
import { connectDB } from "./config/db";
import { isAuthenticated } from "./middlewares/AuthMiddleWires";
import MongoStore from 'connect-mongo';
import "./tasks/cronJob";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// For parsing json data
app.use(express.json());

// For parsing urlencoded data
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 7 * 24 * 60 * 60, // session expires in 7 days
    }),
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
app.use('/api/task', isAuthenticated, taskRoutes);



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

