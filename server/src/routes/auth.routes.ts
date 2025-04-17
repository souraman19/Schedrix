import { Router } from 'express';
import passport from 'passport';

const router = Router();


router.get("/google", 
    passport.authenticate("google", {
      scope: ["profile", "email"] 
    })
)

router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/failure',
      session: true,
    }),
    (req, res) => {
        if (req.user) {
            console.log('Authentication successful');
            console.log('User profile:', req.user);
            res.redirect('http://localhost:3000/home');
        } else {
            console.log('Authentication failed');
            res.redirect('/auth/failure');
        }
    }
);

router.get('/user', (req, res) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.json(req.user); // Send the user info stored in the session
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
});



export default router;