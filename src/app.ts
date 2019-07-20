// lib/app.ts
import express = require('express');
//const BaseballData = require('./baseballdata');
const BaseballImage = require('./baseballimage');
const fs = require('fs');
const stream = require('stream');
const util = require('util');

const teamTable = require('./teams.json');

// Create a new express application instance
async function run() {

    const baseballImage = new BaseballImage();
    
    


    const teams = Object.keys(teamTable);

    for (const team of teams) {
        console.log(`Starting process for team:  ${team}`)
    
        const imageStream = await baseballImage.getImageStream(team);
        console.log("got imagestream");

        // console.log("__dirname: " + __dirname);
        
        console.log("`Writing: " + __dirname +'/../teams/' + team + '.png')
        const out = fs.createWriteStream(__dirname +'/../teams/' + team + '.png');


        const finished = util.promisify(stream.finished);

        imageStream.pipe(out);
        // tslint:disable-next-line:no-console
        out.on('finish', () =>  console.log('The PNG file was created.\n'));

        await finished(out);

    }
}


run();

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });