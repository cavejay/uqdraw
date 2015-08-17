import config from '../config';
let firebaseRoot = config.firebase.base;
let Firebase = require('firebase');
import LoginActions from '../actions/LoginActions.js';

let AuthService = {
  // Checks if user is in the system
  login: function(username, password) {

    // Access the database's Users list
    var usersRef = new Firebase(firebaseRoot+"/Users");

    // Access the child of
    usersRef.child(username).once('value', function(snapshot) {

      // Check if we actually got something
      if (snapshot.val() == null) {
        console.log("We didn't get anything :'( - " + snapshot.val());
        return false;

      } else {
        usersRef.child(username).on("value", function(snapshot) {

          // We should have got data and we can compare it to the pword
          var returnPass = snapshot.val();
          if (returnPass == password){
            console.log("We matched the password!\n "+returnPass+"=="+password);
            return true;
          }
        });
      }
    });
  }

  // creates an entry for username w/ a password of password.
  // Returns 0 if the user already exists
  create: function(username, pasword) {
    return 0;
  }
}

export default AuthService;
