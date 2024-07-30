const express = require("express");
const session = require("express-session");
const sessionConfig = require("./src/middlewares/sessionConfig");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { Sequelize, DataTypes } = require('sequelize');
const cloudinary = require('./src/config/cloudinaryConfig');
const app = express();
const api = require('./src/controllers/api.controller');
const moment = require('moment-timezone');

// Database setup
const sequelize = new Sequelize('dbzvtfeophlfnr', 'u3m7grklvtlo6', 'AekAds@24', {
  host: '35.209.89.182',
  dialect: 'postgres'
});

// Define models
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

const Log = sequelize.define('Log', {
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Middleware for logging actions
const logAction = async (req, action, message) => {
  const ip = req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress || 'Unknown IP';
  await Log.create({ action, message, ip });
};

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.logAction = logAction;
  next();
});

// Routes
app.use("/Dashboard", dashboardRoutes.router);

app.get("/", (req, res) => {
  res.render("Login", { message: null });
});

app.get('/alldata', api.getAllScreensAllData);
app.get('/livedata', api.getAllScreensAllData);

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword });

  // Log the registration action
  await logAction(req, 'register', 'User registered');

  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('Login');
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

    // Log the login action
    await logAction(req, 'login', 'User logged in');

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
    const otpCreationTime = savedOtp.createdAt;
    const currentTime = new Date();
    const timeDifference = (currentTime - otpCreationTime) / 1000; // Time difference in seconds

    if (timeDifference > 60) {
      await OTP.destroy({ where: { id: savedOtp.id } });
      req.flash('error_msg', 'OTP has expired. Please request a new one.');
      console.log('OTP expired');
      res.redirect('/verify-otp');
    } else {
      await OTP.destroy({ where: { id: savedOtp.id } });
      await logAction(req, 'verify-otp', 'OTP verified');
      res.redirect('/Dashboard');
    }
  } else {
    req.flash('error_msg', 'Invalid OTP. Please check and try again.');
    res.redirect('/verify-otp');
  }
});

app.post('/resend-otp', async (req, res) => {
  const user = req.session.user;
  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ userId: user.id, otp });

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
        res.json({ success: false });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ success: true });
      }
    });
  } else {
    res.json({ success: false });
  }
});

// Function to fetch Cloudinary storage data
const getCloudinaryStorageData = async () => {
  try {
    const result = await cloudinary.api.usage();
    console.log('Cloudinary Storage Data:', result); // Debug log
    return result;
  } catch (error) {
    console.error('Error fetching Cloudinary storage data:', error);
  }
};

app.get('/api/cloudinary-storage', async (req, res) => {
  const data = await getCloudinaryStorageData();
  res.json(data);
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/logs', dashboardRoutes.isAuthenticated, async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Convert timestamps to IST
    const logsWithIST = logs.map(log => ({
      ...log.dataValues,
      createdAt: moment(log.createdAt).tz('Asia/Kolkata').format('HH:mm:ss DD-MM-YYYY')
    }));

    res.render('logs', { logs: logsWithIST });
  } catch (error) { 
    console.error('Error fetching logs:', error);
    req.flash('error_msg', 'Error fetching logs. Please try again.');
    res.redirect('/Dashboard');
  }
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
 
