var sidebar = document.getElementById("sidebar")
var bars = document.getElementById('bars')
// var offer = document.getElementById('offer')
// var offerimg = document.getElementById('offerimg')
// var user= document.getElementById('user')
// var glogin=document.querySelector('.g-signin2')
// var offerarr=['1.png','2.png','3.png']
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
return window.location.href="/login"
}
async function  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var ida_token = await googleUser.getAuthResponse().id_token;
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        console.log(googleUser.getAuthResponse())
        console.log(ida_token)
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/verify');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
          console.log('Signed in as: ' + xhr.responseText);
        };
        xhr.send('idtoken=' + ida_token);

  }
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  