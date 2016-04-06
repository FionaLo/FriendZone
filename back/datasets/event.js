/**
 * Created by keithyang on 3/26/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    subtitle: String,
    description: String,
    location: String,
    date: String,
    time: String,
    creator: String,
    attendees: [],
    comments: [
        {
            body: String,
            date: Date
        }
    ],
    meta: {
        joined: Number
    }
});

module.exports = mongoose.model('Event', EventSchema);
