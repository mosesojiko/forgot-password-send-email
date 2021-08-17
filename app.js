const mongoose = require('mongoose')
const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path: './.env'});

const userRoute = require('./routes/userRoutes')

const app = express();

app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:false}))


const DB = process.env.NODE_ENV === 'development' ? process.env.DATABASE_LOCAL : process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => console.log(`Database connection successfull!`))



app.get('/', (req, res) =>{
    res.send("Hello world")
})

app.use('/api/v1/user', userRoute)


const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server listening on port 5000`)
})