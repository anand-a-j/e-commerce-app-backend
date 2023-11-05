const mongoose = require('mongoose');
const authRouter = require('../routes/auth');
const { productSchema } = require('./product');

// schema = structure of user model
const userSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        trim: true
    },
    email:{
        required: true,
        type: String,
        trim: true,
        vaildate: {
          vaildator:(value)=>{
            const regex = /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u;
            return value.match(regex);
          },
          message: 'Please enter a vaild email id'
        }
    },
    password:{
        required: true,
        type: String,
        vaildate: {
          vaildator:(value)=>{
            return value.length > 6;
          },
          message: 'Password must be six characters!'
        }
    },
    address:{
        type: String,
        default: '',
    },
    type: {
      type: String,
      default: 'user',
    },
    cart: [
     {
      product: productSchema,
      quantity: {
        type: Number,
        required: true
      }
     }
    ]
});

const User = mongoose.model('User',userSchema);
module.exports = User;