const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500 ;
const connectdb = require('./config/dbConnect')
const cookiePraser = require('cookie-parser');
const mongoose = require('mongoose')
const router = require("./routes/root")
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const userRouter = require("./routes/userRouter")
const promblemRouter = require('./routes/promblemRouter')
const authRouter = require('./routes/authRouter')
const postRouter = require('./routes/postRouter')
const commentRouter = require("./routes/commentRouter")
connectdb();


app.use(cookiePraser());
app.use(express.json());
app.use(cors(corsOptions));


app.use('/' ,express.static(path.join(__dirname,'public')));
app.use("/",router);
app.use("/post",postRouter)
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/promblem',promblemRouter)
app.use('/comment',commentRouter)
app.all('*',(req,res) => {
    res.status(404);
    if(req.accepts('html')){
       res.sendFile(path.join(__dirname,"views/404.html"))
    }else{
       res.json({message : 'Page is Not Found , 404'})
    }
})

mongoose.connection.once('open',() => { 
   console.log('MongoBd is connected');
  
})
app.listen(PORT,()=>{
   console.log("Server is started at ",PORT )
})

