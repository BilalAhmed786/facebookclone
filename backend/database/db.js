const mongoose =require('mongoose')


mongoose.connect(process.env.MONGO)

.then(()=>{
    console.log('connected to database')
})

.catch((error)=>{

    console.log("Error",error)
})