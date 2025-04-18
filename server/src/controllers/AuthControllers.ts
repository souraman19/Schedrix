import passport from 'passport';


export const googleAuth = passport.authenticate("google", {
        scope: ["profile", "email"] 
      })

export const googleAuthCallback = [ passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        session: true,
      }),
      (req : any, res : any) => {
          if (req.user) {
              console.log('Authentication successful');
              console.log('User profile:', req.user);
              res.redirect('http://localhost:3000/home');
          } else {
              console.log('Authentication failed');
              res.redirect('/auth/failure');
          }
      }
]

export const getUser = (req: any, res: any) => {
    // console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.json(req.user); // Send the user info stored in the session
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
}
