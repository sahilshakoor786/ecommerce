var sidebar = document.getElementById("sidebar")
var bars = document.getElementById('bars')
var offer = document.getElementById('offer')
var offerimg = document.getElementById('offerimg')
var user= document.getElementById('user')
var glogin=document.querySelector('.g-signin2')

var offerarr=['1.png','2.png','3.png']
sidebar.style.visibility='hidden'
bars.onclick=()=>{
let a = sidebar
if(a.style.visibility=="hidden"){
return a.style.visibility='visible'
}
else{
    return   a.style.visibility='hidden'
}
}
user.onclick=()=>{
    var sa= document.cookie.split(';')
    sa.find(item=>{
        if(item.includes('token=')){
            window.location.href="/user"
        }
else            window.location.href="/login"

    })
  
}
function off(){
    let a = offerimg
setTimeout(()=>{
    a.style.opacity=0
        a.setAttribute('src',"img/1.png")
        a.animate({
            'opacity':'100%'    
            },1000)
            setTimeout(()=>a.style.opacity='100%',1000)
},100)
setTimeout(()=>{
a.style.opacity=0
    a.setAttribute('src',"img/2.png")
a.animate({
'opacity':'100%'    
},1000)
setTimeout(()=>a.style.opacity='100%',1000)
    },5000)
    setTimeout(()=>{
        a.style.opacity=0
        a.setAttribute('src',"img/3.png")
        a.animate({
            'opacity':'100%'    
            },1000)
            setTimeout(()=>a.style.opacity='100%',1000)
        },10000)
}
off()
setInterval(off,14000)
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
