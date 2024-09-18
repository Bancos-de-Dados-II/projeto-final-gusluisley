const mongoose = require('../database/mongoose');
const {Schema} = mongoose;
const { randomUUID } = require('crypto');

const restaurantSchema = new Schema({
  _id: {
    type: 'UUID',
    default: randomUUID()
  },
  name:{
    type: String,
    required:true
  },
  description:{
    type:String
  },
  localization: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

restaurantSchema.index(
  {name: 'text', description:'text'},
  {default_language: 'pt', weights:{titulo:2, descricao:1}}
);

const Restaurant = mongoose.model('restaurants', restaurantSchema);

module.exports = Restaurant;