const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authorRoutes = require('./routes/authorRoute.js');
const port = 8080;


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authorRoutes.routes);

app.listen(port, () => console.log('App is listening in url http://localhost:' + port));

