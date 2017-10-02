var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

// to use the mongoose-unique-validator
schema.plugin(mongooseUniqueValidator);

// have blueprint, but want a model; can't instantiate blueprint
// export the model:
module.exports = mongoose.model('User', schema); // will be created as collection users
