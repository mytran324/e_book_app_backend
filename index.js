const express = require('express');
const session = require("express-session");
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const route = require('./routes/index');
const verifyToken = require('./middleware/verifyToken');

dotenv.config();

const app = express();

app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use((req, res, next) => {
    if (req.path !== '/api/admin/login') {
      verifyToken(req, res, next);
    } else {
      next();
    }
});
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "team11_ebook",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

app.use('/api', route);

app.listen(process.env.PORT, () => console.log('App is listening in url http://localhost:' + process.env.PORT));

