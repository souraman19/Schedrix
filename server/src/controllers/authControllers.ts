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
              res.redirect('https://schedrix.vercel.app/in/home');
          } else {
              console.log('Authentication failed');
              res.redirect('/auth/failure');
          }
      }
]

export const getUser = (req: any, res: any) => { 
    // console.log("req.user", req.user);
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export const logout = (req: any, res: any) => {
    req.logout((err: any) => { //callback function to handle logout error
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        // Destroy the session from the server
        req.session.destroy((err: any) => { 
            if (err) {
                return res.status(500).json({ message: 'Failed to destroy session', error: err });
            }
            res.clearCookie('connect.sid'); // Clear the cookie from the client
            res.status(200).json({ message: 'Logged out successfully' });
        })
    })
}
