
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require('./config/db.connection.js');

const PORT = process.env.PORT;
const mainController = require('./controllers/mainController');
const authController = require('./controllers/authController')

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use('/movie', mainController);
app.use('/auth', authController);

app.get("/", (req, res) => {
    res.send("Hello Netflicks");
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));