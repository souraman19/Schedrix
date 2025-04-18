import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type User = {
    googleId: string;
    name: string;
    email: string;
    username: string;
    userImage?: string;
    age?: number;
    phoneNo?: string;
    points?: number;
    bio?: string;
    joinedAt?: string;
    mindStatus?: string;
    badgeList?: string[];
    progress?: {
        totalTasks: number;
        completedTasks: number;
        pointsEarned: number;
        currentStreak: number;
        longestStreak: number;
    };
} | null;

type UserStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
};


export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
                user: null,
                setUser: (user) => set({ user }),
                clearUser: () => set({ user: null }),
            }),
        {
            name: 'user-storage',
        }
    ),
   
)