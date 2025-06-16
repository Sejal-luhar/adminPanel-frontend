require("dotenv").config({path:"./.env"})
require('./src/config/db')
const express=require("express")
const morgan=require("morgan")
const cookieParser=require('cookie-parser')
const cors=require('cors')
const {errorHandler}=require('./src/middlewares/errorHandler')
const userRouter=require('./src/routes/user.Route')
const adminRouter=require('./src/routes/admin.Route')
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('tiny'));

// cors setup

app.use(cors({
    origin:'https://admin-frontend-six-rose.vercel.app',
    credentials:true
}));

// Routes
app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);

// error handling


app.use("*",(req,res,next)=>{
    const error = new Error("Route Not Found");
    error.status = 404;
    next(error);
})
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,  // Include the error message
    });
  });

  
app.use(errorHandler);  

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on Port ${process.env.PORT}`);
    
})