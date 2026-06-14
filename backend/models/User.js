const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // අපි Profile Page එකේ 'name' කියලා පාවිච්චි කළ නිසා මෙතනත් 'name' ලෙස වෙනස් කළා
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },

    phone: { 
        type: String 
    }, 
    address: { 
        type: String 
    }, 
    gender: { 
        type: String, 
        default: 'Not Specified' 
    } 
}, { collection: 'users' }); 

const model = mongoose.model('User', UserSchema);

module.exports = model;