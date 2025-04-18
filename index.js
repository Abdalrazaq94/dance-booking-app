const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');
const cookieParser = require('cookie-parser');

// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//  Attach decoded user to each request if JWT exists
const attachUser = require('./middleware/attachUser');
app.use(attachUser);

// Static files
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


// View engine
const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Routes
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

// Start server & listen to the host
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

