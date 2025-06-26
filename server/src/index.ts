import express, { Request, Response } from "express";
import dotenv from "dotenv";
import session from 'express-session';
import passport from 'passport';
import './utils/passport';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/tasks.routes';
import userRoutes from './routes/user.routes';
import contentRoutes from './routes/content.routes';
import cors from 'cors';
import { connectDB } from "./config/db";
import { isAuthenticated } from "./middlewares/AuthMiddleWires";
import MongoStore from 'connect-mongo';
// import "./tasks/cronJob";
// import "./tasks/CheckMissedCron";
import path from "path";


setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`🧠 Memory usage: ${Math.round(used * 100) / 100} MB`);
}, 10000);



dotenv.config();

const app = express();
const port = process.env.PORT || 5000 || 7000 || 11000;

// For parsing json data
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use("/uploads/tasks", express.static(path.join(__dirname, '..', 'uploads/tasks')));

// For parsing urlencoded data
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: ['https://schedrix.vercel.app'],
  credentials: true
}))

// Trust proxy so secure cookies work (needed for Render + Vercel combo)
app.set('trust proxy', 1);


app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 7 * 24 * 60 * 60, // session expires in 7 days
    }),
    cookie: {
      httpOnly: true, 
      secure: true, // true in production with HTTPS
      sameSite: 'none', // or 'none' if using HTTPS cross-site
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    }
  }),
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/task', isAuthenticated, taskRoutes);
app.use('/api/user', isAuthenticated, userRoutes)
app.use('/api/content', isAuthenticated, contentRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

