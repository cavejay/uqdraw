var firebaseRoot = 'https://uqartifex.firebaseio.com/'
var Firebase = require('firebase');

// Please keep the version up to date with package.json
// v0.1

/* This App loads in all the activeLecture nodes from the database and removes
   all the active lectures that don't have an active question set.

   The idea is that this would run at the end of the day and pick up any still
   unused codes for use the next day
 */

var refs = []; // clear the array
var ref = new Firebase(firebaseRoot+"/activeLectures");
var count = [0, 0];

ref.once('value', function(snapshot) {
  snapshot.forEach(function(child) {
	console.log(" Checking: "+child.key()+" - "+child.val().activeQ);
	var t = {'key': child.key(), 'val':child.val().activeQ};
	refs.push(t);
  })

  refs.forEach(function(r) {
    count[0]++; count[1]++;
    if (r.val === 'NONE') {
      ref.child(r.key).remove(function(){count[0]--});
      console.log(" Removed: "+r.key);
    } else {
      console.log(" Didn't remove "+r.key+" as \"NONE\" !== "+r.val);
      count[0]--;
    }
    if (count[0] === 0 && count[1] === refs.length) process.exit();
  });

  // Can't kill the process 'cause we're waiting for the remove functions
});
