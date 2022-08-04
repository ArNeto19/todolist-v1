//- App generals //
//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('Public'));
//--
app.set('view engine', 'ejs');
mongoose.connect(`mongodb+srv://admin-${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.wx5ya.mongodb.net/todolistDB`, {
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});
const ListItem = mongoose.model('listItem', itemsSchema);


app.get('/', function(req, res) {

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  let today = new Date();
  let day = today.toLocaleDateString('en-US', options);


  ListItem.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      res.render('list', {
        actualDate: day,
        newListItems: foundItems

      });
    }

  });



});

app.post('/', function(req, res) {

  let newItem = req.body.newItem;
  let item = new ListItem({
    name: newItem
  });
  item.save();

  res.redirect('/');
});

app.post('/delete', function(req, res) {

  let checkedItem = req.body.checkbox;

  setTimeout(function() {
    ListItem.deleteOne({checkedItem}, function(err){
      if (err) {
        console.log(err);
      }
    });
    res.redirect('/');
  }, 2000);

});


app.listen(process.env.PORT || 3000, function() {
  console.log('Server running smoothly');
});
