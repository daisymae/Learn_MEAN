var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
  content: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

/** The following creates a listener in the model. Whenever the 
 * remove() server call is made, this will be triggered. It will use the
 * message that is being removed (still has a handle to it) to find the
 * user and remove the message from the list of messages associated 
 * with the user.
 * Remember to save the modified user
 */
schema.post('remove', function (message) {
  User.findById(message.user, function (err, user) {
    user.messages.pull(message);
    user.save();
  });
});

// have blueprint, but want a model; can't instantiate blueprint
// export the model:
module.exports = mongoose.model('Message', schema); // will be created as collection messages
