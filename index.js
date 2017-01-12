const express     = require('express');
const morgan      = require('morgan');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const mongoose    = require('mongoose');
const port        = process.env.PORT || 3000;
const router      = require('./config/routes');
const apiRouter   = require('./config/apiRoutes');
const expressJWT = require('express-jwt');
const config = require('./config/config');
const app = express();
mongoose.connect(config.databaseUrl);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/bower_components`));

app.use('/api', expressJWT({ secret: config.secret })
  .unless({
    path: [
      { url: '/api/register', methods: ['POST'] },
      { url: '/api/login',    methods: ['POST'] }
    ]
  }));
app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next){
  if (err.name !== 'UnauthorizedError') return next();
  return res.status(401).json({ message: 'Unauthorized request.' });
}


app.use('/', router);
app.use('/api', apiRouter);

app.listen(port, () => console.log(`Express running on port ${port}`));
