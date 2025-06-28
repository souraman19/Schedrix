import express,  { Request, Response }  from "express";
import { connectDB } from "./config/db";

import "./tasks/cronJob";
import "./tasks/CheckMissedCron";
import "./lib/queues/reminderWorker";
import "./lib/queues/motivationalVideoFetchWorker";
import "./lib/queues/quoteFetchWorker";

const app = express();
const port = process.env.PORT || 8000;

connectDB();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});
  
  app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
    
    console.log("🔄 Background services initialized");
