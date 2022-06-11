const mongoose = require('mongoose');

const dburl = 'mongodb://localhost:27017/user'
mongoose.connect(dburl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

let productSchema = mongoose.Schema({
    name:String,
    amout:Number,
    password:String,
    img:String
})

let User = mongoose.model("User",productSchema)

module.exports=User;

module.exports.saveData=(data)=>{
    data.save(data)
}