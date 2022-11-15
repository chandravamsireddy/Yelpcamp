const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');
const campground = require('../models/campground');
const { response } = require('express');
mongoose.connect('mongodb://localhost:27017/yelpcamp')

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 15;
    const camp = new campground({
      //your user ID
      author: "63547df36ac3c6c61e54017b",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[rand1000].city},${cities[rand1000].state}`,
      description: 'Good descriptive writing creates an impression in the readers mind of an event, a place, a person, or a thing. The writing will be such that it will set a mood or describe something in such detail that if the reader saw it, they would recognize it',
      price,
      geometry: {
        type: 'Point', coordinates: [cities[rand1000].longitude, cities[rand1000].latitude,]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dep7sg8hg/image/upload/v1666564942/YelpCamp/ux81qpskbsxcdqec1nhq.jpg',
          filename: 'YelpCamp/ux81qpskbsxcdqec1nhq',
        },
        {
          url: 'https://res.cloudinary.com/dep7sg8hg/image/upload/v1666564943/YelpCamp/sfbxjccpd09lnozqo7q1.jpg',
          filename: 'YelpCamp/sfbxjccpd09lnozqo7q1',
        }
      ]
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
