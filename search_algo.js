var express = require('express');
var router = express.Router();

// Get query
router.get('/', function(req, res, next) {
	//whatever the user puts into the search box
	var query = req.query.q.split(' '); 
	var matches = [];
	var username;

	//find the user
	User.findOne({email: query}, function(err, user){
		if(err){
			console.log("Error occurred in search (User find).");
			return;
		}
		if(user){
			username = user.username;
			return username;
		}
		
	});
		
	//find the event. TODO: need to make a list of events (if not already in)
	Event.find({}, function(err, events) {
		if(err) {
			console.log("Error occurred in search (Listing find).");
			return;
		}
		
		//go through a list of events (?)
		for(i = 0; i < events.length; i++) {
			// iterate through all events
			var nameWords = events[i].name.split(' ');
			for(j = 0; j < query.length; j++) {
				// iterate through each query word
				var found = false;
				
				for(k = 0; k < nameWords.length; k++) {
					// Check against each title word
					if(query[j].toLowerCase() == nameWords[k].toLowerCase()) {
						// Found a match
						matches.push(events[i]);
						found = true;
						break;
					}
				}
				if(found) {
					continue;
				}

			}
			//TODO : should putting the username also find that person's events?
			//if yes, can use this below 
			if(events[i].poster == username){
				matches.push(events[i]);
			}
		}

		//search box
		res.locals.events = matches;
		res.render('search', {title: "Search", query: query.join(' ')});
		
	});
});

module.exports = router;

