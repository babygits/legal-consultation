var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require('./models');
var indexRouter = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lawyerRoutes = require('./routes/lawyerRoutes');
const consultRoutes = require('./routes/consultRoutes');
const caseRoutes = require('./routes/caseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const chatRoutes = require('./routes/chatRoutes');

// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('✅ Database synced.');
//   })
//   .catch((err) => {
//     console.error('❌ Failed to sync database:', err);
//   });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/consults', consultRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/chat', chatRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
