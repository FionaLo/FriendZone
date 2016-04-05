/**
 * Created by keithyang on 3/26/16.
 */

var Event = require('../datasets/event');

// Create endpoint /api/events for POSTS
exports.postEvents = function(req, res) {
    // Create a new instance of the Event model
    var event = new Event({
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
    });

    event.save(function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'event created',
            data: event
        });
    });

};

// Create endpoint /api/events for GET
exports.getEvents = function(req, res) {
    // Use the event model to find all event
    Event.find(req['query'], function(err, events) {
        if (err) {
            res.send(err);
        } else {
            res.json(events);
        }
    });
};

// Create endpoint /api/events/:event_id for GET
exports.getEvent = function(req, res) {
    // Use the Event model to find a specific event
    Event.findById(req.params.event_id, function(err, event) {
        if (err) res.send(err);

        res.json(event);
    });
};

// Create endpoint /api/events/:event_id for PUT
exports.putEvent = function(req, res) {
    // Use the Event model to find a specific event
    Event.findById(req.params.event_id, function(err, event) {
        if (err)
            res.send(err);

        // Update the existing event name
        event.name = req.body.name;

        // Update the existing event description
        event.description = req.body.description;

        // Save the event and check for errors
        event.save(function(err) {
            if (err)
                res.send(err);

            res.json(event);
        });
    });
};

// Create endpoint /api/events/:event_id for DELETE
exports.deleteEvent = function(req, res) {
    // Use the Event model to find a specific event and remove it
    Event.findByIdAndRemove(req.params.event_id, function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'event deleted' });
    });
};
