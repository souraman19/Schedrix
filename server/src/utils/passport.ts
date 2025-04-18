import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User, IUser } from '../models/User';

dotenv.config();

// console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
  }, async(accessToken : string, refreshToken: string, profile: Profile, cb : VerifyCallback) => {
    console.log(profile);
    try{
        const existingUser = await User.findOne({googleId: profile.id});
        if(existingUser){
            return cb(null, existingUser as any);
        } else {
            const newUser = new User({
                googleId: profile.id,
                name: profile.name?.givenName,
                email: ((profile.emails as unknown) as {value: string}[])?.[0]?.value,
                username: profile.displayName,
                userImage: ((profile.photos as unknown) as {value: string}[])?.[0]?.value,
            })
            await newUser.save();
            return cb(null, newUser as any);
        }
    }catch(err){
        console.error(err);
        return cb(err, null as any);
    }
}));

passport.serializeUser((user: Express.User, cb: (error: any, user?: Express.User | false) => void) => {
    cb(null, user);
});

passport.deserializeUser((obj: any, cb: (error: any, user?: Express.User | false) => void) => {
    cb(null, obj);
});
