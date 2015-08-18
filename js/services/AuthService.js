import config from '../config';
let firebaseRoot = config.firebase.base;
let Firebase = require('firebase');
import LoginActions from '../actions/LoginActions.js';

let EventEmitter = require('events').EventEmitter;

let AuthService = {
  emitter: new EventEmitter()
}

  // Checks if user is in the system
AuthService.login = function(username, password, callback, router) {

    // Access the database's Users list
    var usersRef = new Firebase(firebaseRoot+"/Users");

    // Access the child of
    usersRef.child(username).once('value', function(snapshot) {

      // Check if we actually got something
      if (snapshot.val() == null) {
        console.log("We didn't get anything :'( - " + snapshot.val());
        return 0;

      } else {
        usersRef.child(username).once("value", function(snapshot) {

          // We should have got data and we can compare it to the pword
          var returnPass = snapshot.val();
          if (returnPass == password){
            console.log("We matched the password!\n "+returnPass+"=="+password);
            callback(username, router);
            return 0;
          }
        });
      }
    });

    return 0;
  }

  // creates an entry for username w/ a password of password.
  // Returns 0 if the user already exists
AuthService.create = function(username, pasword) {
    return 0;
  }


export default AuthService;
