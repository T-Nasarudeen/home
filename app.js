const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const Username = 'qwerty';
const Password = '1234';

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === Username && password === Password) {
    req.session.user = username;
    res.redirect('/home');
  } else {
    res.render('login', { message: 'Incorrect username or password' });
  }
});

app.get('/home', requireLogin, (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.render('home');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
