const mongoose=require('mongoose')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is Required']
    },
    email:{
        type:String,
        required:[true,'Email is Required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is Required'],
        select:false
    },role: {
        type: String,
        enum: ['instructor', 'student'],
        default: 'student', 
      },
      profilePicture: {
        type: String,
        default: 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D', // Replace with your default image URL
      },
      
    isAdmin:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

userSchema.methods.generateAuthToken = function () {
   const token = jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
      email: this.email,
      username: this.username
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }
  );
  
    return token;
  };
  
  userSchema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email }).select("+password");
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log(isMatch)
  
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
  
    return user;
  };
  
  userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  
module.exports= mongoose.model('User',userSchema)