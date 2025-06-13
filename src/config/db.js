const mongoose=require('mongoose')

mongoose.connect(process.env.MONGOURL)
.then(()=>{
    console.log('Database connected Succesfully');
    
})
.catch((err)=>{
    console.log(err.message);
    
})