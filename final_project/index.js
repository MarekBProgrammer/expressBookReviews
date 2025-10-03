const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization && req.session.authorization.user) {
    next();
} else if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]; // zakładając "Bearer <token>"
    jwt.verify(token, "access", (err, user) => {
        if (!err) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
  } else {
    return res.status(403).json({ message: "User not authenticated" });
  }
});
 
const PORT =5000;

app.use("/", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
