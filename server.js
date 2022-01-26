'use strict';

// import libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// import mongoose library so we can our mongo db
const mongoose = require('mongoose');

// must bring in our Cat Schema IF we want to interact with Cat models
const Cat = require('./model/cat');

// connect mongoose to our mongo DB
mongoose.connect(process.env.DB_URL);

// connection validation
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected')
});


// implement our Express server
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('Hello From the SERVER!');
})

app.get('/cats', handleGetCats);
app.post('/cats', handlePostCats);
app.delete('/cats/:id', handleDeleteCats);
app.put('/cats/:id', handlePutCats)
// what 2 verbs can update?  
// patch - smaller changes - 1 or more, 
// put make achange and replace entireexisting record 


async function handleGetCats(req, res) {
  let queryObject = {};

  if (req.query.location) {
    queryObject = {
      location: req.query.location
    }
  }

  try {
    // return all results with an empty object, or enter object with location to get all cats for that location 
    let catsFromDb = await Cat.find(queryObject);
    if (catsFromDb.length > 0) {
      res.status(200).send(catsFromDb);
    } else {
      res.status(404).send('No Cats Found');
    }
  } catch(err){
    res.status(500).send('Server Error');
  }
}

async function handlePostCats(req, res){
  // proof of life.  does the req.body have the info I need?
  // if the req.body has EXACTLY the obj I need, I can pass that to the create() method
  console.log(req.body);
  console.log(req.query.email)
  // res.send('proof of life');
  try {
    const catWeMade = await Cat.create(req.body)
    res.status(201).send(catWeMade);
  } catch(err){
    res.status(500).send('Server Error')
  }

}

// pasted this here so we can see what's up with :id.  it's a wild card, a parameter of our choose - why parameter? becasue I have NO IDEA what the value will be and cannot access it otherwise  
// app.delete('/cats/:id', handleDeleteCats);
async function handleDeleteCats(req, res){
  // proof of life
  // console.log(req.params.id)
  // let { id } = req.params
  // res.send('route hit');
  let id = req.params.id;
  try {
    await Cat.findByIdAndDelete(id);
    res.status(204).send('cat deleted');
  } catch(err){
    res.status(404).send(`unable to delete ${id}`)
  }
} 

// app.put('/cats/:id', handlePutCats)
async function handlePutCats(req, res){
  let id = req.params.id
  try{
    // must pass three things to the findByIdAndUpdate() method.  
    // 1. id, 
    // 2. data object
    // 3. options object
    let updatedCat = await Cat.findByIdAndUpdate(id, req.body, {new:true, overwrite: true});
    res.status(200).send(updatedCat);
  } catch(err){
    res.status(404).send(`unable to update ${id}`)
  }
}


app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
