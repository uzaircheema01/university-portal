const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session setup
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true
}));

// Load users from JSON file
const users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

// Home Route
app.get("/", (req, res) => {
    res.render("index");
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// Login Authentication
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;  // Store user in session
        res.redirect("/dashboard");
    } else {
        res.render("login", { error: "Invalid username or password. Try again!" });
    }
});

// Dashboard (Only accessible if logged in)
app.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("dashboard", { user: req.session.user });
});

// Logout Route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
