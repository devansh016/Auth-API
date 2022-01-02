const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

//To remove extra information
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
        delete ret.createdDate;
    }
});

userSchema.methods = {
    getUserData: function() {
            return {
                    "username": this.username,
                    "name": this.name,
                    "email": this.email
                };
        }
}
module.exports = mongoose.model('User', userSchema);