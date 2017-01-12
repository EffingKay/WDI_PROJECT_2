const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mongoose   = require('mongoose');
const port       = process.env.PORT || 3000;
const config     = require('./config/config');
const router     = require('./config/routes');
const app = express();

mongoose.connect(config.databaseUrl);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/bower_components`));
app.use('/', router);

app.listen(port, () => console.log(`Express running on port ${port}`));
