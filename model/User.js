const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  displayName: String,
  username: { type: String, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  avatar: String,
  role: { type: String, enum: ['admin', 'store', 'employee'] },
  additionalInfo: mongoose.Schema.Types.Mixed, 
},
{ timestamps: true });

userSchema.virtual('roleData').get(function() {
  return this.additionalInfo[this.role];
});

userSchema.pre('save', async function(next) {
  if (!this.firstName || !this.lastName) return next();
  this.displayName = `${this.firstName} ${this.lastName}`;
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});


userSchema.statics.defineRoleFields = function(role, fields) {
  this.schema.add({
    additionalInfo: {
      [role]: fields,
    
    },
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
