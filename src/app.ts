// lib/app.ts
import fs = require('fs');
import stream = require('stream');
import util = require('util');

const logger = require("./logger");
logger.setLevel("verbose");

const BaseballImage = require('./baseballimage');
const teamTable = require('../teams.json');

// Create a new express application instance
async function run() {
    const baseballImage = new BaseballImage(logger);

    const teams = Object.keys(teamTable);

    for (const team of teams) {
        // tslint:disable-next-line:no-console
        logger.info(`Starting process for team:  ${team}`)
    
        const result = await baseballImage.getImageStream(team);
        const imageStream = result.stream;
        
        // tslint:disable-next-line:no-console
        logger.info("Writing: ./teams/" + team + ".png, Expires: " + result.expires)
        const out = fs.createWriteStream(__dirname +'/../teams/' + team + '.png');

        const finished = util.promisify(stream.finished);

        imageStream.pipe(out);
        // tslint:disable-next-line:no-console
        out.on('finish', () =>  logger.info('The PNG file was created.\n'));

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