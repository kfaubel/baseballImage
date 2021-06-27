// lib/app.ts
import fs = require('fs');
import stream = require('stream');
import util = require('util');

const logger = require("../src/logger");
logger.setLevel("verbose");

//const BaseballImage = require('./baseballimage');
import { BaseballImage } from './baseballimage';
const teamTable = require('../teams.json');

fs.mkdirSync(__dirname + '/../teams/', { recursive: true })

// Create a new express application instance
async function run() {
    const baseballImage = new BaseballImage(logger);
    const teams = Object.keys(teamTable);

    for (let team of teams) {
        logger.info(`test.ts: Requesting image for:  ${team}`)
    
        const result = await baseballImage.getImageStream(team);
    
        logger.info(`test.ts: Writing: ./teams/${team}.jpg`);
        // We now get result.jpegImg
        fs.writeFileSync(__dirname +'/../teams/' + team + '.jpg', result.jpegImg.data);

        // logger.info(`Writing from stream: ./teams/${team}2.jpg`);

        // const out = fs.createWriteStream(__dirname +'/../teams/' + team + '2.jpg');
        // const finished = util.promisify(stream.finished);

        // result.stream.pipe(out);
        // out.on('finish', () =>  logger.info('The jpg from a stream file was created.'));

        // await finished(out); 
    }
}

run();