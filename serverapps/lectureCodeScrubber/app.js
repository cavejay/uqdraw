var firebaseRoot = 'https://uqartifex.firebaseio.com/'
var Firebase = require('firebase');

/* This App loads in all the activeLecture nodes from the database and removes
   all the active lectures that don't have an active question set.

   The idea is that this would run at the end of the day and pick up any still
   unused codes for use the next day
 */

var refs = []; // clear the array
var ref = new Firebase(firebaseRoot+"/activeLectures");

ref.once('value', function(snapshot) {
  snapshot.forEach(function(child) {
	console.log(" Checking: "+child.key()+" - "+child.val().activeQ);
	var t = {'key': child.key(), 'val':child.val().activeQ};
	refs.push(t);
  })

  refs.forEach(function(r) {
    if (r.val === 'NONE') {
      ref.child(r.key).remove();
      console.log(" Removed: "+r.key);
    } else {
      console.log(" Didn't remove "+r.key+" as \"NONE\" !== "+r.val);
    }
  });

  // Can't kill the process 'cause we're waiting for the remove functions
});
