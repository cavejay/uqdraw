var util = require('util');
var rl = require("readline");
var Firebase = require('firebase');
process.stdin.setEncoding('utf8');

// Please keep the version up to date with package.json
// v0.0.1

/* This App provides an easy method for admins to create new users
   or reset their passwords as needed.
 */

var firebaseRoot;
var username;
var password;
var prompts = rl.createInterface(process.stdin, process.stdout);

// Create a new file reader
var rl = require('readline').createInterface({
  input: require('fs').createReadStream('../../js/config.js')
});

// Read in the file
rl.on('line', function (line) {
  // If the line has ' base:' in it, it's the right line
  if(line.search(" base:") != -1) {

    // Do some disgusting string cleaning incase people edited config.js slightly differently
    var start = line.search(":");
    if(line.charAt(start+1) == " ") start = start+1;
    var focus = line.substring(start, line.length - 2).trim();

    if(focus.charAt(0) == "'" || focus.charAt(0) == "\"") focus = focus.slice(1);
    if(focus.charAt(focus.length-1) == "'" || focus.charAt(focus.length-1) == "\"") focus = focus.slice(-1);

    firebaseRoot = focus;

    // Start the interaction
    rant();
  }
});

var rant = function() {
  console.log("\nWelcome to the UQDraw user creation utility!");
  console.log("Judging from the repo we're going to be adding/editing a user on the following firebase:");
  console.log("\""+firebaseRoot+"\"");
  console.log("\nPlease enter either the user you wish to create, or the user who's password you wish to update. Please note that letter capitalisation is important.")

  // Prompt for things
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

// Make a new user on the db
var newUser = function(username, password) {
  // We don't like empty things
  if(username === "" || password === "") {
    console.log("!!! Username and password MUST NOT be empty strings.\n   Closing Utility");
  }

  // Actually do the adding to the database.
  var ref = new Firebase(firebaseRoot+"/Users");
  var t = {};
  t[username] = password;
  ref.update(t, function(retcode) {
    if(retcode) {
      console.log('Failed to update the database!');
    } else {
      console.log('User was successfully updated!');
    }
    console.log("Closing utility now");
    process.exit(); // close the utility :D
  });
}
