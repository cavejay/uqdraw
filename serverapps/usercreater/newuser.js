// var config = require('../../js/config');
var util = require('util');
var rl = require("readline");
var Firebase = require('firebase');
process.stdin.setEncoding('utf8');
// var firebaseRoot = config.firebase.base;

// Please keep the version up to date with package.json
// v0.1

/* This App provides an easy method for admins to create new users
   or reset their passwords as needed.
 */

var firebaseRoot;
var username;
var password;
var prompts = rl.createInterface(process.stdin, process.stdout);

var rl = require('readline').createInterface({
  input: require('fs').createReadStream('../../js/config.js')
});

rl.on('line', function (line) {
  if(line.search(" base:") != -1) {
    var start = line.search(":");
    if(line.charAt(start+1) == " ") start = start+1;
    var focus = line.substring(start, line.length - 2).trim();

    if(focus.charAt(0) == "'" || focus.charAt(0) == "\"") focus = focus.slice(1);
    if(focus.charAt(focus.length-1) == "'" || focus.charAt(focus.length-1) == "\"") focus = focus.slice(-1);

    firebaseRoot = focus;
    rant();
  }
});

var rant = function() {
  console.log("\nWelcome to the UQDraw user creation utility!");
  console.log("Judging from the repo we're going to be adding/editing a user on the following firebase:");
  console.log("<"+firebaseRoot+">");
  console.log("\nPlease enter either the user you wish to create, or the user who's password you wish to update. Please note that letter capitalisation is important.")

  prompts.question("username: ", function (text) {
    username = text;
    prompts.question("password: ", function (text) {
      password = text;
      console.log("To confirm: You would like to create the following: User="+username+" - Password="+password);
      prompts.question("(y/n): ", function (text) {
        if(text !== "y") {
          console.log("User wasn't created, closing utility");
        } else {
          console.log("Updating database with new user information");
          newUser(username, password);
        }
        process.stdin.pause();
      });
    });
  });
}

var newUser = function(username, password) {
  if(username === "" || password === "") {
    console.log("!!! Username and password MUST NOT be empty strings.\n   Closing Utility");
  }

  var ref = new Firebase(firebaseRoot+"/Users");
  var t = {'key': username, 'val':password};
  ref.push(t, function(retcode) {
    console.log("Return code from firebase was: "+retcode+"\nClosing Utility now");
    process.exit();
  });
}
