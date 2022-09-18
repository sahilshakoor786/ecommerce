require("dotenv").config()
const express=require("express")
const http=require("http")
const jwt = require("jsonwebtoken")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const fs = require('fs')
const cors = require('cors')
var nodemailer = require('nodemailer');
const {OAuth2Client} = require('google-auth-library');
const { request } = require("https")
const app=express()
var emailcode=[]
const server = http.Server(app)
const io = require('socket.io')(server)
const saltrounds=5
app.listen(3000)
app.use(express.static(__dirname+'/img'))
app.use(express.static(__dirname+'/styles'))
app.use(express.static(__dirname+'/scripts'))
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname))
mongoose.connect('mongodb://Ayaan:'+"maharaj"+'@localhost:27017/aman',(err)=>{
if (err)return console.log(err)
else console.log('connected')
})
const userModal = new mongoose.Schema({
    'name':String,
    'password':String,
    'email':String
},{collection:"user"})
app.use(cors({origin:'*'}))
const cartschema= new mongoose.Schema({
    email:String,
    cart_item_id:Number
},{collection:"user_cart"})
const cart= new mongoose.model('cart',cartschema)
const productSchema= new mongoose.Schema({
    'name':String,
    'description':String,
    "productid":Number,
    'price':Number,
    'side_effects':String,
    'category':String,
    "faqs":String,
    'original_price': Number,
    'selling_price':Number 
},{collection:"products"})
const products=new mongoose.model('products',productSchema)
const user= new mongoose.model('user',userModal)
app.set('views','./')
app.get('/',(req,res)=>{
    res.status(200).sendFile(__dirname+'/index.html')
})
app.set('view engine','ejs')
app.use(express.json())
fs.readdir(__dirname+'/products',(err,item)=>{
    item.forEach(data=>{
        app.use(express.static(__dirname+`/products/${data}`))
    })
})
app.get('/login',(req,res)=>{
res.sendFile(__dirname+'/signin.html')

})
async function storepass(data,response){
    var pass=data.body.password
    var email=data.body.email
    var name=data.body.name
    var code=data.body.code
    var hashedpass
    
bcrypt.hash(pass, saltrounds).then(function(hash) {
    hashedpass=hash
    user.where({'name':name,'email':email}).exec((err,res)=>{
        if(res.length!=0){
  return response.send(alert('User Already exists'))
        }
        else{
    emailcode.find(item=>{
        if(item.email==email){
            if(item.code==code){
                const newuser= new user({
                    'name':name,
                    'email':email,
                    'password':hashedpass
                })
                newuser.save().then(()=>{
                    tokengen(data,response)
                    item.email=''
                    item.code=''
                })
            }
            else{
                
            }
        }
    })
  
        }
    })
  
});

}
app.post('/newuser',async(req,response)=>{
await storepass(req,response)
})
function tokengen(req,res){
    var token = jwt.sign(req.body,process.env.TOKEN)
    // console.log(token)
    res.json({'token':token})
}
app.get("/signup",(req,res)=>{
    res.status(200).sendFile(__dirname+"/signup.html")
})
function verify(req,res,next){
var as = req.headers.cookie.toString().split(';')
var l=as[as.length-1].replace('token=','')
var token= l.trim()
// console.log(token)
jwt.verify(token,process.env.TOKEN,(err,usr)=>
{
    if(token=="ergerewgg"){
     return   res.redirect("/login")
    }
    if(err){
        console.log(err)
    res.redirect('/login')
    }
if(usr){    
    user.where({'email':usr.email}).exec((err,resa)=>{
        if(resa.length!=0){
            usr.name=resa[0].name
bcrypt.compare(usr.password,resa[0].password).then((result)=>{
    if (result==true){
        console.log('done')
        res.render('user.ejs',{
            usr
                })

    }
    else return res.send("<script>alert("+"\"Wrong password entered\");window.location.href=\"/login\""+"</script>")
})
        }
    else return res.send("<script>alert("+"\"No user exists !\");window.location.href=\"/login\""+"</script>")
    }
    )
}
})
}
app.post('/verify',verify)
app.post('/signin',tokengen)
app.get('/user',verify)
app.post('/emailverify',emv)
function emv(req,res){
    var code = Math.round(Math.random()*100000)
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'jodie.lueilwitz@ethereal.email',
                pass: '6majEEKR3Egx1YNVKf'
            }
        });
        var mailOptions = {
            from: 'jodie.lueilwitz@ethereal.email',
            to: req.body.email,
            subject: 'Verification Code',
            html:"<center><h2>Your verification code for nootropicsforbrain.com is :</h2> <h1>"+code+"</h1></center>"
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
emailcode.push({email:req.body.email,code:code})           
            }
          }); 
    });
              
          
}
app.get('/products/:productid',(req,res)=>{
    var productID=req.params.productid
    products.where({'productid':productID}).exec((err,resa)=>{
        if (err){
            return res.send("<script>alert(\"No product exists\")</script>")
        }    
        var item = resa[0]
  res.render('product.ejs',{item})
    })
})

// console.log(token)
app.post('/cart',(req,res)=>{
    var as = req.headers.cookie.toString().split(';')
var l=as[as.length-1].replace('token=','')
var token= l.trim()
jwt.verify(token,process.env.TOKEN,(err,usr)=>
{
    if(token=="ergerewgg"){
     return   res.send({
         "res":"fail"
     })
    }
    if(err){
        console.log(err)
    res.redirect('/login')
    }
if(usr){    
    user.where({'email':usr.email}).exec((err,resa)=>{
        if(resa.length!=0){
            usr.name=resa[0].name
bcrypt.compare(usr.password,resa[0].password).then((result)=>{
    if (result==true){
        console.log('done')
     var ca= new cart({
        email:resa[0].email,
        cart_item_id:req.body.item

     })
     ca.save().then(()=>{
         console.log("done")
     })
    }
})
        }
    })
}
})
})