/**
 * Created by keithyang on 3/26/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    description: String,
    comments: [
        {
            body: String,
            date: Date
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    meta: {
        joined: Number
    }
});

module.exports = mongoose.model('Event', EventSchema);
