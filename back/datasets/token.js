/**
 * Created by keithyang on 4/4/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    value: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Token', TokenSchema);
