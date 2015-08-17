import config from '../config';
let firebaseRoot = config.firebase.base;
let Firebase = require('firebase');
import LoginActions from '../actions/LoginActions.js';

class AuthService{

  login(username, password) {
  var userCheck = new Firebase("https://uqartifex.firebaseio.com/Users");
   userCheck.child(username).once('value', function(snapshot) {
  if  (snapshot.val()==null){
                 console.log(snapshot.val());   
          } else {
          var ref = new Firebase("https://uqartifex.firebaseio.com/Users/"+username);
          ref.on("value", function(snapshot) {
          var returnPass = snapshot.val();
          if (returnPass == password){
					console.log(returnPass);   
	
		}
          
          });
          
          }
  
  });
  }
  }
export default new AuthService()
