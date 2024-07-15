const express = require("express");
const session = require("express-session");
const sessionConfig = require("./src/middlewares/sessionConfig");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const flash = require('connect-flash');
const app = express();
// const port = process.env.PORT || 3000;
 const api=require('./src/controllers/api.controller')

const bodyParser = require('body-parser');
// const session = require('express-session');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { Sequelize, DataTypes } = require('sequelize');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());
// Database setup
const sequelize = new Sequelize('dbzvtfeophlfnr', 'u3m7grklvtlo6', 'AekAds@24', {     
  host: '35.209.89.182',
  dialect: 'postgres'
});
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// app.use("/login", loginRoutes);
app.use("/Dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.render("Login", { message: null });
});

app.get('/alldata',api.getAllScreensAllData);
// app.listen(port, () => {
//   console.log(Example app listening on port ${port});
// });










const User = sequelize.define('User', {
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false
  }
});

const OTP = sequelize.define('OTP', {
  userId: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  otp: {
      type: DataTypes.STRING,
      allowNull: false
  }
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword });
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user && await bcrypt.compare(password, user.password)) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.create({ userId: user.id, otp });
      req.session.otp = otp;
      req.session.user = user;

      // Send OTP via email
      let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'aekads.otp@gmail.com',
              pass: 'ntkp cloo wjnx atep'
          }
      });

      let mailOptions = {
          from: 'aekads.otp@gmail.com',
          to: user.email,
          subject: 'Your login OTP Code',
          text: `Your login OTP code is ${otp}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });

      res.redirect('/verify-otp');  
  } else {
    req.flash('error_msg', 'Invalid email or password. Please check and try again.');
    res.redirect('/');
}
});

app.get('/verify-otp', (req, res) => {
  res.render('verify-otp');
});


app.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const savedOtp = await OTP.findOne({ where: { userId: req.session.user.id, otp } });
  if (savedOtp) {
      await OTP.destroy({ where: { id: savedOtp.id } });
      res.redirect('/Dashboard');
  } else {
     req.flash('error_msg', 'Invalid OTP. Please check and try again.');
      res.redirect('/verify-otp');
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
      console.log('Server is running on port 3000');
  });
});
