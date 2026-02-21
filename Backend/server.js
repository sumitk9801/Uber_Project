const dotenv = require("dotenv").config();
const http = require("http");
const app = require("./app");
const Server = http.createServer(app);
const ConnectDB  = require("./db/db.js");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
ConnectDB();


const port = process.env.PORT||3000;

app.use(passport.initialize());

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

// Route to start login
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Callback route
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" , session: false }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URI}`); // redirect to frontend
  }
);


Server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

Server.on("error",(error)=>{
    console.log(error)
})