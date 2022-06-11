
const express = require('express');
const { redirect, cookie } = require('express/lib/response');
const { contentDisposition } = require('express/lib/utils');
const router = express.Router()
const multer = require('multer')
const User=require('./model/model.js');
console.log(User)

//creat storage
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/img')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.filename)
    }
})
const upload = multer({storage:storage})


router.get('/',(req,res)=>{
    res.render('login.ejs')
}).post('/login',upload.single('img'),(req,res)=>{
    let data = new User({
        name:req.body.name,
        password:req.body.password,
        img:req.file.filename
    })
    User.saveData(data);
    const username = req.body.name;
    const password = req.body.password;
    if(username==="admin"&&password==="123"){
        res.cookie('username',username,{maxAge:999999})
        res.cookie('password',password,{maxAge:999999})
        res.cookie('login',true,{maxAge:999999})
        res.cookie('user','admin',{maxAge:999999})
        res.redirect('/message')
    }else{
        res.cookie('username',username,{maxAge:12000})
        res.cookie('password',password,{maxAge:12000})
        res.cookie('login',true,{maxAge:12000})
        res.cookie('user','client',{maxAge:12000})
        res.redirect('/game')
    }
})
router.get('/message',(req,res)=>{
    const io = req.app.get('socketio')
    io.emit('routest',{
        test:"router"
    })
    if(req.cookies.user === "admin" && req.cookies.login){
        User.findOne({password:"321"}).exec((err,doc)=>{
            res.render('chat.ejs',{data:doc})
            User.findOne({password:"123"}).exec((err,doc)=>{
                module.exports.sender={
                    name:doc.name,
                    img:doc.img
                }
            })
          //  res.render('chat.ejs',{data:doc})
        })
    }else{
        User.findOneAndDelete({password:'123'},{usefileAndmodify:false}).exec(err=>{
            res.redirect('/')
        })
    }
})

router.get('/game',(req,res)=>{
    if(req.cookies.user === "client" && req.cookies.login){
        User.findOne({password:"321"}).exec((err,doc)=>{
            res.render('game.ejs',{data:doc}) 
            User.findOne({name:'duck'}).exec((err,doc)=>{
                let amout = doc.amout
                User.findOne({password:"321"}).exec((err,doc)=>{
                    console.log(amout)
                    module.exports.sender={
                        name:doc.name,
                        img:doc.img,
                        amout:amout
                    }
                })
            })
        })  
    }else{
        User.findOneAndDelete({password:'321'},{usefileAndmodify:false}).exec(err=>{
            res.redirect('/')
        })
    }
}).get('/chat',(req,res)=>{
    if(req.cookies.user === "client" && req.cookies.login){
        User.findOne({password:"123"}).exec((err,doc)=>{
            res.render('chat.ejs',{data:doc})
        })  
    }else{
        User.findOneAndDelete({password:'321'},{usefileAndmodify:false}).exec(err=>{
            res.redirect('/')
        })
    }
})

router.get('/setuser',(req,res)=>{
    if(req.cookies.user==='admin'){
    res.render('setuser.ejs')
    }else{
        res.render('404.ejs')
    }
})

router.post('/edit_user',upload.single('img'),(req,res)=>{
    console.log(req.file)
    const data = {
        name:req.body.name,
        img:req.file.filename
    }
    User.findOneAndUpdate({password:"321"},data,{usefileAndmodify:false}).exec(err=>{
        console.log(err)
    })
    res.redirect('/setuser')
})

router.get('/setgame',(req,res)=>{
    if(req.cookies.user==="admin"){
    User.findOne({name:"duck"}).exec((err,doc)=>{
        res.render('setgame.ejs',{data:doc});
    })
}
else{
    res.render('404.ejs')
}
})

router.post('/editgame',upload.single('img'),(req,res)=>{
    let data={
        name:"duck",       
        amout:req.body.amout
    }
    User.findOneAndUpdate({name:'duck'},data,{usefileAndmodify:false}).exec(err=>{
        if(err)console.log(err);
    })
    res.redirect('/setgame')

})


module.exports=router;
