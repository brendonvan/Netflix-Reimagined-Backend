require("dotenv").config();
//require('./config/db.connection');

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const PORT = 4000;
const mainController = require('./controllers/mainController');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/movie', mainController);

app.get("/", (req, res) => {
    res.send("Hello Netflicks");
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));