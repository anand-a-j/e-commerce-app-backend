// Imports from packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

// Imports from other files
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// Init
const PORT = process.env.PORT || 3000;
const app = express();
const DB = "mongodb+srv://anandaj:%40nAnd2001@cluster0.0tprisw.mongodb.net/?retryWrites=true&w=majority"

// Middleware - act as middle man between client and sever
// Client -> Middleware -> Sever-> Client
app.use(cors());
app.use(express.json()); 
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// Connection to mongoose
mongoose.connect(DB).then(()=>{
  // console.log("MongoDB Connection Successful");
}).catch(e =>{
  // console.log(e);
});

// creating an api
app.listen(PORT,"0.0.0.0",() => {
    // console.log(`connect at port ${PORT} checked`);
});



