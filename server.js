require("dotenv").config();
//require('./config/db.connection');

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require("connect-mongo");

const PORT = 4000;
const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController')

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(session)({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: '258369147',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    }
})

app.use('/movie', mainController);
app.use('/auth', authController);

app.get("/", (req, res) => {
    res.send("Hello Netflicks");
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));