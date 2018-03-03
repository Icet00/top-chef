const phantom = require('phantom');
var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var json    = [];

(async function() {

  //To load the javascript data
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
  });

  console.log("scraping started");

  const status = await page.open('https://m.lafourchette.com/fr_FR/search?ll=48.856614,2.3522219000000177&searchText=Paris,%20France&googlePlaceId=ChIJD7fiBh9u5kcRYJSMaMOCCwQ');
  
  //Auto scroll down
  for(var i =0; i < 100;i++)//Enough time to have all the 807 restaurants
  {
    if(i % 5 == 0)
    {
      console.log("scraping at " + i + "%");
    }
    //Scroll down
    await page.property('scrollPosition', {top: i*1000, left:0});
    //Wait loading data
    await page.on('onResourceRequested', function(requestData) {
      //Need to keep this else this will make a call to an url which doesn't answer
    });
    //Wait javascript loading in the phantom headless browser
    await wait(1000);
  }

  console.log("scraping finished");


  const content = await page.property('content');

  scraping(content);


  instance.exit();

  

  
})();

function wait (timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}



function scraping(content)
{
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
    }
  });

  //To write the data
  fs.writeFile('restaurants.json', JSON.stringify(json, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved ' + json.length + ' restaurants into restaurants.json!');
  });
}