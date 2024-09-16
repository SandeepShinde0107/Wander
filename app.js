// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

// const express = require("express");
// const morgan = require('morgan');
// const mongoose = require("mongoose");
// const winston = require('winston');
// const multer = require('multer');
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");

// const app = express();

// const Listing = require("./models/listing.js");
// const User = require("./models/user.js");
// const Review = require("./models/review.js");
// const reviewsRouter = require("./routes/review.js");
// const listingRouter = require("./routes/listing.js");
// const userRouter = require("./routes/user.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");

// const dbUrl = process.env.ATLASDB_URL;

// // Create a logger
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//     ),
//     transports: [
//         new winston.transports.Console()
//     ]
// });

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });
// const upload = multer({ storage });

// // Connect to MongoDB Atlas
// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//     tls: true, // Ensure TLS is enabled
//     tlsAllowInvalidCertificates: true // Optional: Use this if you are connecting to a local instance with self-signed certificates
// })
// .then(() => {
//     logger.info('Connected to MongoDB Atlas');
// })
// .catch(err => {
//     logger.error('MongoDB Atlas connection error:', err);
//     process.exit(1); // Exit the process if unable to connect to MongoDB
// });

// // Middleware and configuration
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));
// app.use(morgan('dev'));

// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });
//  store.on("error",()=>{
//     console.log("error in mongo session store", err);
//  })
// // Session configuration
// const sessionOptions = {
//     store,
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//     },
// };


// app.use(session(sessionOptions));
// app.use(flash());

// // Passport middleware setup
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Middleware to pass flash messages and current user to all views
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });

// // Routes
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/", userRouter);

// // Example route for file upload
// app.post('/upload', upload.single('file'), (req, res) => {
//     res.send('File uploaded successfully');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     logger.error(err.stack);
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { message });
// });

// // 404 Error handling middleware
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

// // Start server
// const port = 8080;
// app.listen(port, () => {
//     logger.info(`Server is listening on port ${port}`);
// });
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }
  const fs=require('fs');
  const express = require("express");
  const morgan = require('morgan');
  const mongoose = require("mongoose");
  const winston = require('winston');
  const multer = require('multer');
  const path = require('path');
  const methodOverride = require("method-override");
  const ejsMate = require("ejs-mate");
  const session = require("express-session");
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  
  const app = express();
  
  const Listing = require("./models/listing.js");
  const User = require("./models/user.js");
  const Review = require("./models/review.js");
  const reviewsRouter = require("./routes/review.js");
  const listingRouter = require("./routes/listing.js");
  const userRouter = require("./routes/user.js");
  const wrapAsync = require("./utils/wrapAsync.js");
  const ExpressError = require("./utils/ExpressError.js");
  const { listingSchema, reviewSchema } = require("./schema.js");
  
  const dbUrl = process.env.ATLASDB_URL;
  
  // Create a logger
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console()
    ]
  });
  const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

  
  // Multer storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });
  
  // Connect to MongoDB Atlas
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    tls: true, // Ensure TLS is enabled
    tlsAllowInvalidCertificates: true // Optional: Use this if you are connecting to a local instance with self-signed certificates
  })
  .then(() => {
    logger.info('Connected to MongoDB Atlas');
  })
  .catch(err => {
    logger.error('MongoDB Atlas connection error:', err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  });
  
  // Middleware and configuration
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine("ejs", ejsMate);
  app.use(express.static(path.join(__dirname, "/public")));
  app.use(morgan('dev'));
  
  const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  });
  store.on("error",()=>{
    console.log("error in mongo session store", err);
  })
  // Session configuration
  const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  };
  
  
  app.use(session(sessionOptions));
  app.use(flash());
  
  // Passport middleware setup
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  // Middleware to pass flash messages and current user to all views
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });
  
  // Routes
  app.use("/listings", listingRouter);
  app.use("/listings/:id/reviews", reviewsRouter);
  app.use("/", userRouter);
  
  // Example route for file upload
 app.post('/upload', (req, res, next) => {
   upload.single('file')(req, res, function (err) {
       if (err instanceof multer.MulterError) {
           console.error('Multer error:', err);
           return res.status(500).send('Multer Error: ' + err.message);
       } else if (err) {
           console.error('Unknown error:', err);
           return res.status(500).send('Unknown Error: ' + err.message);
       }

       if (!req.file) {
           console.error('No file uploaded');
           return res.status(400).send('No file uploaded.');
       }
       res.send('File uploaded successfully');
   });
});


  
  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
  });
  
  // 404 Error handling middleware
  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
  });
  
  // Start server
  const port = 8080;
  app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });