import mongoose , {Document, Schema, model, Types} from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    name: string;
    email: string;
    username: string;
    userImage?: string;
    phoneNo?: string;
    age?: number;
    bio?: string;
    joinedAt: Date;
    mindStatus?: string;
    badgeList: string[];
    progress: {
      totalTasks: number;
      completedTasks: number;
      overdueTasks: number;
      points: number;
      pointsGained: number;
      currentStreak: number;
      longestStreak: number;
    };
    taskCategory: string[];
    notifications: {
      enabled: boolean;
      defaultRemainderTimeBefore: number; // in minutes
    }
  };

const userSchema = new Schema<IUser>({
    googleId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    userImage: {type: String},
    phoneNo: {type: String},
    age: {type: Number},
    bio: {type: String},
    joinedAt: {type: Date, default: Date.now},
    mindStatus: {
      type: String,
      enum: [
        "Focused",      // ✅ High productivity, deep work
        "Distracted",   // ❗ Not engaged, easily diverted
        "Tired",        // 😴 Low energy, need rest
        "Stressed",     // ⚠️ Overwhelmed, urgent attention
        "Motivated",    // 💪 Energized, positive drive
        "Default",     // 🔄 Neutral state, no specific feeling
      ],      
      default: "Default"
    },    
    badgeList: [{type: String}],
    progress: {
        totalTasks: {type: Number, default: 0},
        completedTasks: {type: Number, default: 0},
        overdueTasks: {type: Number, default: 0},
        points: {type: Number, default: 0},
        pointsGained: {type: Number, default: 0},
        currentStreak: {type: Number, default: 0},
        longestStreak: {type: Number, default: 0}
    }, 
    taskCategory: {
        type: [String],
        default: ['General', 'Work', 'Health', 'Personal']
    },
    notifications:{
      enabled: {type: Boolean, default: true},
    }
},{ timestamps: true })

export const User = model<IUser>('User', userSchema);