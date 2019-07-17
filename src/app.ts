// lib/app.ts
import express = require('express');
const BaseballData = require('./baseballdata');
//const WeatherImage = require('./baseballimage');

// Create a new express application instance
async function run() {

    const baseballData = new BaseballData();
    const today = new Date();

    console.log("Today is: " + today);

    const result1 = await baseballData.getGames(today, "BOS");
    const result2 = await baseballData.getGames(today, "BOS");
    





   
    

    //const imageStream = weatherImage.getImageStream();

    // console.log("__dirname: " + __dirname);
    // const fs = require('fs');
    // const out = fs.createWriteStream(__dirname +'/../test.png');

    // imageStream.pipe(out);
    // // tslint:disable-next-line:no-console
    // out.on('finish', () =>  console.log('The PNG file was created.\n'));
}

run();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });