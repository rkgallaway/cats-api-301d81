'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

// import a cat schema, be and sure and nuild it FIRST!
const Cat = require('./model/cat');

async function seed() {


  // {
  //   name: String,
  //   color: String,
  //   hasClaws: Boolean,
  //   location: String
  // }
  // seeddb with cats!
  const scamper = new Cat({
    name: 'Scamper',
    color: 'gray',
    hasClaws: true,
    location: 'Moses Lake'
  });

  // don't disconnect here!
  scamper.save(function (err) {
    if (err) console.error(err);
    else console.log('scamper saved');
  })

  // another way to do this is to "create" as opposed to save
  await Cat.create({
    name: 'Felix',
    color: 'gray and black',
    hasClaws: true,
    location: 'Seattle'
  })
  console.log('felix saved');

  mongoose.disconnect();
}

seed();
