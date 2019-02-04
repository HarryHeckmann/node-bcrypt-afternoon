require('dotenv').config()

const express = require("express");
const app = express();
const PORT = 4000;
const massive = require("massive");
const session = require("express-session");
const {json} =  require('body-parser')
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const ac = require('./controllers/authController')
const tc = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

app.use(json())

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
)


massive(CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("Database connected");
  });


app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)

app.get('/api/treasure/dragon', tc.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, tc.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, tc.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, tc.getAllTreasure)
  

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });