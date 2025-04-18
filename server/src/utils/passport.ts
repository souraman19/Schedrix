import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

// console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
  }, async(accessToken : string, refreshToken: string, profile: Profile, cb : VerifyCallback) => {
    // console.log(profile); 
    cb(null, profile);
}));

passport.serializeUser((user: Express.User, cb: (error: any, user?: Express.User | false) => void) => {
    cb(null, user);
});

passport.deserializeUser((obj: any, cb: (error: any, user?: Express.User | false) => void) => {
    cb(null, obj);
});
