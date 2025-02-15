import mongoose, { Schema } from 'mongoose';

/* @@ User Model
 *
 * @ Description: A user is a fundamental piece in the application, it represents actors in the
 * business logic. There are two kinds of users: Administrator and Common user. A administrator
 * have privileges over the system, while common one have privileges over events. Users can be
 * both administrator and comum user, sometimes.
 *
 * Read the docs to have a full description: /docs/user.br.md (in portuguese)
 * Mongoose Models documentation: http://mongoosejs.com/docs/models.html
 *
 * @ Log
 * Maradona Morais '2017-08-13 17:06': First definition
 * Maradona Morais '2017-08-20 00:23': Create multiples exports (both, schema and model)
 *                                     + Field subdocument support
 * Maradona Morais '2017-08-20 14:15': Remove field with current definition, it is a definition for
 *                                     Field Request
 * Maradona Morais '2017-08-27 16:06': Removes name, email and password fields. It will be included
 *                                     in ofFields
 * Maradona Morais '2017-10-25 12:16': Removes photo, it is unusefull
 */

const userSchema = new Schema({
  name: { // Name of the user
    type: String,
    required: true,
  },
  email: { // Email of the user
    type: String,
    required: true,
    unique: true, // Email is also a key
  },
  emailConfirmation: { // tells if the user's mail was confirmed
    type: Boolean,
    default: false,
  },
  password: { // Encrypted password
    type: String,
    required: true,
  },
  passwordCode: {
    type: String,
    default: '',
  },
  ofTypes: [String], // types of user: Administrator, Common or both.
  // ofFields uses subdocs Mongoose's feature: http://mongoosejs.com/docs/subdocs.html
  ofFields: [], // Array of fields that can be defined by a administrator TODO: Link with field
  ofEvents: [{ // Array of references to events that the user is enrolled in
    type: Schema.Types.ObjectId,
    ref: 'Event',
  }],
  active: { // tells if the account was desactivated
    type: Boolean,
    default: true,
  },
  createdAt: { // Date of creation of the instance
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model('User', userSchema);
export { userSchema };
export default userModel;
