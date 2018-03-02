const phantom = require('phantom');
var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var json    = [];
var i       = 1;

(async function() {

  //To load the javascript data
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });

  const status = await page.open('https://m.lafourchette.com/fr_FR/search?ll=48.856614,2.3522219000000177&searchText=Paris,%20France&googlePlaceId=ChIJD7fiBh9u5kcRYJSMaMOCCwQ');
  const content = await page.property('content');

  //To search the data
  var $ = cheerio.load(content);

  $('.restaurantResult-cell').each(function(i, elem){
    
    var data = $(elem);
    var restau = {name: "", price: "", offer: "", rating: "",  genre: ""};
    restau.name = data.find(".restaurantResult-name").text();
    restau.rating = data.find(".restaurantResult-ratingValue").text();
    restau.genre = data.find(".restaurantResult-tag").eq(0).text();
    restau.price = data.find(".restaurantResult-tag").eq(1).text();
    restau.offer = data.find(".restaurantResult-promotion").text();
    //the class "restaurantResult-cell restaurantResult-cell--Picture" not taken
    if(restau.name != "")
    {
      json.push(restau);
      console.log(restau);
    }
  });

  //To write the data
  fs.writeFile('restaurants.json', JSON.stringify(json, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved into restaurants.json!');
  });

  await instance.exit();
})();