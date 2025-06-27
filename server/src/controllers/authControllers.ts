import passport from "passport";

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = [
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    session: true,
  }),
  (req: any, res: any) => {
    if (req.user) {
      console.log("Authentication successful");
      res.send(`
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Logging you in...</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: radial-gradient(circle at center, #0f0f0f, #000);
          color: #fff;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }

        .glow {
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(to right, #00c853, #b2ff59);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pulse 2s infinite;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(0, 200, 83, 0.2);
          border-top-color: #00c853;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-top: 20px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            text-shadow: 0 0 10px #00c853, 0 0 20px #b2ff59;
          }
          50% {
            text-shadow: 0 0 20px #b2ff59, 0 0 40px #00c853;
          }
        }
      </style>
    </head>
    <body>
      <div class="glow">Logging you in...</div>
      <div class="spinner"></div>

      <script>
        setTimeout(() => {
          window.location.href = "https://schedrix.vercel.app/in/home";
        }, 100);
      </script>
    </body>
  </html>
`);
    } else {
      console.log("Authentication failed");
      res.redirect("/auth/failure");
    }
  },
];

export const getUser = (req: any, res: any) => {
  // console.log("req.user", req.user);
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const logout = (req: any, res: any) => {
  req.logout((err: any) => {
    //callback function to handle logout error
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }
    // Destroy the session from the server
    req.session.destroy((err: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to destroy session", error: err });
      }
      res.clearCookie("connect.sid"); // Clear the cookie from the client
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
