var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var json    = [];
var i       = 1;

const configuration = {
  'uri': 'https://m.lafourchette.com/fr_FR/search?ll=48.856614,2.3522219000000177&searchText=Paris,%20France&googlePlaceId=ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
};

app.get('/', function(req, res){
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));
  console.log(obj.length);
  res.send(obj);
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;